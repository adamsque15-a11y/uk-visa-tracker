import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAccount, accountInitial, accountName, accountSubtext } from '../../hooks/useAccount';
import { useAuth } from '../../hooks/useAuth';
import { useTier } from '../../hooks/useTier';
import { performSignOut } from '../../lib/authActions';
import { supabase } from '../../lib/supabase';
import { openSupportEmail } from '../../lib/legalConfig';
import { getBookmarkedIds, loadBookmarks, subscribeBookmarks } from '../../lib/bookmarks';
import { isLocalModeActive } from '../../lib/localMode';
import { loadLocalPremium, isLocalPremiumActive, setLocalPremium, subscribeLocalPremium } from '../../lib/tier';
import {
  NotificationPrefs,
  getNotificationPrefs,
  loadNotificationPrefs,
  setNotificationPref,
  subscribeNotificationPrefs,
} from '../../lib/notificationPrefs';
import Screen from '../../components/Screen';
import Icon from '../../components/Icon';
import UpgradeModal from '../../components/UpgradeModal';
import SignOutModal from '../../components/SignOutModal';
import { colors } from '../../lib/theme';

const NOTIFICATION_OPTIONS: { key: keyof NotificationPrefs; label: string; description: string }[] = [
  {
    key: 'deadlineReminders',
    label: 'Deadline reminders',
    description: 'Callouts on your dashboard when a biometrics or document deadline is coming up.',
  },
  {
    key: 'processingUpdates',
    label: 'Processing time updates',
    description: 'Let me know if Home Office standard processing times change for my visa type.',
  },
  {
    key: 'englishPrepReminders',
    label: 'English test practice reminders',
    description: 'Nudges to keep your daily practice streak going.',
  },
  {
    key: 'communityInsights',
    label: 'Community insights updates',
    description: 'Let me know when new approval-trend research is added.',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const account = useAccount();
  const { session } = useAuth();
  const { premium } = useTier();
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [prefs, setPrefs] = useState<NotificationPrefs>(getNotificationPrefs());
  const [localPremium, setLocalPremiumState] = useState(isLocalPremiumActive());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  // Server-synced (profiles.email_reminders_opt_in) — a different concept
  // from the local-only NOTIFICATION_OPTIONS toggles below, so it's shown
  // in its own section. Only meaningful for a real signed-in account: guest
  // and dev-test sessions have no email on file to send reminders to.
  const [emailRemindersOptIn, setEmailRemindersOptIn] = useState<boolean | null>(null);

  useEffect(() => {
    loadBookmarks().then(() => setBookmarkCount(getBookmarkedIds().size));
    const unsubscribeBookmarks = subscribeBookmarks((ids) => setBookmarkCount(ids.size));

    loadNotificationPrefs().then(setPrefs);
    const unsubscribePrefs = subscribeNotificationPrefs(setPrefs);

    loadLocalPremium().then(setLocalPremiumState);
    const unsubscribePremium = subscribeLocalPremium(setLocalPremiumState);

    return () => {
      unsubscribeBookmarks();
      unsubscribePrefs();
      unsubscribePremium();
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase
      .from('profiles')
      .select('email_reminders_opt_in')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setEmailRemindersOptIn(data?.email_reminders_opt_in ?? true));
  }, [session]);

  async function handleToggleEmailReminders(value: boolean) {
    if (!session) return;
    setEmailRemindersOptIn(value);
    await supabase.from('profiles').update({ email_reminders_opt_in: value }).eq('id', session.user.id);
  }

  return (
    <Screen style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.accountCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{accountInitial(account)}</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{accountName(account)}</Text>
          <Text style={styles.accountSubtext}>{accountSubtext(account)}</Text>
        </View>
      </View>

      <Text style={styles.sectionHeading}>Membership</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="award" size={18} color={colors.primary} style={styles.rowIcon} />
          <View style={styles.rowTextGroup}>
            <Text style={styles.rowLabel}>{premium ? 'Premium' : 'Free'}</Text>
            <Text style={styles.rowValue}>
              {premium
                ? 'Unlimited speaking practice, weak-topic drills, and the study plan generator.'
                : 'Upgrade for unlimited speaking practice, weak-topic drills, and the study plan generator.'}
            </Text>
          </View>
        </View>
        {!premium && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={() => setShowUpgradeModal(true)}>
              <Icon name="arrow-up-circle" size={18} color={colors.primary} style={styles.rowIcon} />
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowLabel}>Upgrade to Premium</Text>
                <Text style={styles.rowValue}>Pricing coming soon</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </>
        )}
        {isLocalModeActive() && (
          <>
            <View style={styles.divider} />
            <View style={styles.toggleRow}>
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowLabel}>Simulate Premium (testing only)</Text>
                <Text style={styles.rowDescription}>
                  Dev/guest-mode only — preview premium-gated features before payments are wired up.
                </Text>
              </View>
              <Switch value={localPremium} onValueChange={setLocalPremium} trackColor={{ true: '#1a3c6e' }} />
            </View>
          </>
        )}
      </View>

      <UpgradeModal visible={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />

      <Text style={styles.sectionHeading}>Settings</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={() => router.push('/(tabs)/visa-info')}>
          <Icon name="star" size={18} color={colors.primary} style={styles.rowIcon} />
          <View style={styles.rowTextGroup}>
            <Text style={styles.rowLabel}>Saved Articles</Text>
            <Text style={styles.rowValue}>{bookmarkCount} bookmarked</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.row} onPress={openSupportEmail}>
          <Icon name="mail" size={18} color={colors.primary} style={styles.rowIcon} />
          <View style={styles.rowTextGroup}>
            <Text style={styles.rowLabel}>Contact us</Text>
            <Text style={styles.rowValue}>Report an issue or ask a question</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Icon name="info" size={18} color={colors.textSecondary} style={styles.rowIcon} />
          <View style={styles.rowTextGroup}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionHeading}>Notifications</Text>
      <Text style={styles.sectionSubheading}>
        These control what the app shows you in-app — they're not push notifications.
      </Text>
      <View style={styles.card}>
        {NOTIFICATION_OPTIONS.map((option, index) => (
          <View key={option.key}>
            {index > 0 && <View style={styles.divider} />}
            <View style={styles.toggleRow}>
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowLabel}>{option.label}</Text>
                <Text style={styles.rowDescription}>{option.description}</Text>
              </View>
              <Switch
                value={prefs[option.key]}
                onValueChange={(value) => setNotificationPref(option.key, value)}
                trackColor={{ true: '#1a3c6e' }}
              />
            </View>
          </View>
        ))}
      </View>

      {session && emailRemindersOptIn !== null && (
        <>
          <Text style={styles.sectionHeading}>Email Reminders</Text>
          <Text style={styles.sectionSubheading}>
            Biometrics and decision-date reminders sent to your email — you can also unsubscribe directly from any
            reminder email.
          </Text>
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.rowTextGroup}>
                <Text style={styles.rowLabel}>Email reminders</Text>
                <Text style={styles.rowDescription}>
                  A heads-up a few days before your biometrics appointment and as your estimated decision date
                  approaches.
                </Text>
              </View>
              <Switch value={emailRemindersOptIn} onValueChange={handleToggleEmailReminders} trackColor={{ true: '#1a3c6e' }} />
            </View>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={() => setShowSignOutModal(true)}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <SignOutModal
        visible={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={() => {
          setShowSignOutModal(false);
          performSignOut(router);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fa' },
  content: { padding: 20, paddingBottom: 48 },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1a3c6e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  accountInfo: { flex: 1 },
  accountName: { fontSize: 16, fontWeight: '700', color: '#222' },
  accountSubtext: { fontSize: 13, color: '#777', marginTop: 3 },
  sectionHeading: { fontSize: 14, fontWeight: '700', color: '#555', marginBottom: 6, marginTop: 4 },
  sectionSubheading: { fontSize: 12, color: '#999', marginBottom: 8, marginTop: -2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  rowIcon: { fontSize: 18, marginRight: 12 },
  rowTextGroup: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '600', color: '#222' },
  rowValue: { fontSize: 13, color: '#999', marginTop: 2 },
  rowDescription: { fontSize: 12, color: '#888', marginTop: 3, lineHeight: 17, paddingRight: 12 },
  chevron: { fontSize: 20, color: '#ccc' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 16 },
  signOutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5484d',
  },
  signOutText: { color: '#e5484d', fontWeight: '700', fontSize: 15 },
});

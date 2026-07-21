import { QuizQuestion, ListenDiscussItem } from './types';
import { CEFRLevel } from './level';

// Mock test bank — "which sentence is correct" style questions, mirroring
// the real IELTS Life Skills A1 speaking format (choose the natural, correct
// way to answer).
export const MOCK_TEST_BANK_A1: QuizQuestion[] = [
  { id: 'mock-1', question: "What's your name?", options: ['My name Ahmed', 'My name is Ahmed', 'I Ahmed'], correctIndex: 1 },
  { id: 'mock-2', question: 'Where do you live?', options: ['I live in India', 'I living India', 'Live India'], correctIndex: 0 },
  { id: 'mock-3', question: 'How old are you?', options: ['I am 25 years', 'I 25 years old', 'I am 25 years old'], correctIndex: 2 },
  { id: 'mock-4', question: 'Are you married?', options: ['Yes, I married', 'Yes, I am married', 'Yes, married am I'], correctIndex: 1 },
  { id: 'mock-5', question: 'What time is it?', options: ["It's three o'clock", 'Is three clock', 'Three the clock'], correctIndex: 0 },
  { id: 'mock-6', question: "What's the weather like today?", options: ['Today sunny', "It's sunny today", 'Sunny is today'], correctIndex: 1 },
  { id: 'mock-7', question: 'Do you have children?', options: ['Yes, I have two children', 'Yes, I children two', 'Children yes two'], correctIndex: 0 },
  { id: 'mock-8', question: 'What do you do for work?', options: ['I work as a teacher', 'I teacher work', 'Work I teacher'], correctIndex: 0 },
  { id: 'mock-9', question: 'How much is this?', options: ['It costs ten pounds', 'Cost it ten pounds', 'Ten pounds it cost'], correctIndex: 0 },
  { id: 'mock-10', question: 'Where is the bus stop?', options: ['Turn left it is', "It's on the left", 'Left it is on'], correctIndex: 1 },
  { id: 'mock-11', question: "What's your address?", options: ['I live at 12 Green Street', 'Live I 12 Green Street', '12 Green Street I live'], correctIndex: 0 },
  { id: 'mock-12', question: 'What did you eat for breakfast?', options: ['I ate toast and tea', 'Ate I toast and tea', 'Toast tea I ate'], correctIndex: 0 },
  { id: 'mock-13', question: 'How many brothers and sisters do you have?', options: ['I have one brother', 'Have I one brother', 'One brother have'], correctIndex: 0 },
  { id: 'mock-14', question: 'What is your favourite food?', options: ['My favourite food is rice', 'Favourite food rice my', 'Food favourite my rice'], correctIndex: 0 },
  { id: 'mock-15', question: 'Can you describe your house?', options: ['My house has three bedrooms', 'House has three my bedrooms', 'Three bedrooms house my'], correctIndex: 0 },
  { id: 'mock-16', question: 'What do you usually do at the weekend?', options: ['I usually visit my family', 'Usually I visit family my', 'Visit usually I my family'], correctIndex: 0 },
  { id: 'mock-17', question: 'Why do you want to live in the UK?', options: ['I want to live with my husband', 'Want I live husband my with', 'Live husband my want I with'], correctIndex: 0 },
  { id: 'mock-18', question: "What's your phone number?", options: ["It's 07123 456789", 'Is 07123 456789', 'Phone 07123 456789 is'], correctIndex: 0 },
  { id: 'mock-19', question: 'How do you travel to work?', options: ['I travel by bus', 'Travel I bus by', 'By bus travel I'], correctIndex: 0 },
  { id: 'mock-20', question: "What's the date today?", options: ["It's the 9th of July", 'Is the 9th of July', 'Date today 9th July'], correctIndex: 0 },
];

// A2 — mirrors more complex real-life exchanges: past tense, comparisons,
// and short explanations rather than single facts.
export const MOCK_TEST_BANK_A2: QuizQuestion[] = [
  { id: 'mock-a2-1', question: 'How was your weekend?', options: ['It was nice, I visit my family', 'It was nice, I visited my family', 'It nice, I visited family'], correctIndex: 1 },
  { id: 'mock-a2-2', question: 'Why are you late?', options: ["I'm late because the bus didn't come", "I'm late because bus didn't come", 'Late because no bus'], correctIndex: 0 },
  { id: 'mock-a2-3', question: 'Which is cheaper, the bus or the train?', options: ['Bus cheaper than train', 'The bus is cheaper than the train', 'The bus cheap more'], correctIndex: 1 },
  { id: 'mock-a2-4', question: 'What do you think about the new bus route?', options: ['In my opinion, it is much faster', 'My opinion it faster much', 'Opinion is it faster'], correctIndex: 0 },
  { id: 'mock-a2-5', question: 'Have you ever visited London?', options: ["Yes, I've been there twice", 'Yes, I been there two time', 'Yes I visit two time'], correctIndex: 0 },
  { id: 'mock-a2-6', question: 'What happened at the appointment?', options: ['The doctor said I need to rest', 'The doctor say I need rest', 'Doctor said need rest I'], correctIndex: 0 },
  { id: 'mock-a2-7', question: "There's something wrong with my boiler — what should I say to the engineer?", options: ["It's broken since Tuesday", 'It stopped working on Tuesday', 'Tuesday it not working'], correctIndex: 1 },
  { id: 'mock-a2-8', question: 'How long have you worked here?', options: ["I've been working here for two years", 'I work here for two years since', 'Two years I working here'], correctIndex: 0 },
  { id: 'mock-a2-9', question: 'What would you do if the flight was cancelled?', options: ["I'd book another one straight away", 'I book another one straight away would', 'Would I book another'], correctIndex: 0 },
  { id: 'mock-a2-10', question: 'Which do you prefer, tea or coffee?', options: ['I prefer tea to coffee', 'I prefer more tea than coffee', 'Tea I prefer than coffee'], correctIndex: 0 },
  { id: 'mock-a2-11', question: "What's your neighbourhood like?", options: ["It's quiet and well connected", 'Is quiet and connected well', 'Quiet connected well is it'], correctIndex: 0 },
  { id: 'mock-a2-12', question: 'Why did you choose that flat?', options: ['I chose it because it was close to work', 'I choose it because close to work', 'Chose because work close'], correctIndex: 0 },
  { id: 'mock-a2-13', question: "What's the best way to renew a driving licence?", options: ['You can apply online, it usually', 'You can apply online — it usually takes a few weeks', 'Apply online takes weeks'], correctIndex: 1 },
  { id: 'mock-a2-14', question: 'Do you think working from home is better?', options: ['On the other hand it depend', 'On the other hand, it depends on the job', 'Other hand depends job'], correctIndex: 1 },
  { id: 'mock-a2-15', question: 'What did you buy recently?', options: ['I recently bought a washing machine', 'I recent buy washing machine', 'Recently bought washing machine I'], correctIndex: 0 },
];

// B1 — tests more nuanced, extended structures: reasoning, hypotheticals,
// and abstract topics rather than short factual answers.
export const MOCK_TEST_BANK_B1: QuizQuestion[] = [
  { id: 'mock-b1-1', question: 'Why did you decide to apply for settlement?', options: ['I decided to apply because I want to stay long-term', 'I decide apply because want stay', 'Because want stay I apply'], correctIndex: 0 },
  { id: 'mock-b1-2', question: 'What are your long-term goals?', options: ['My long-term goal to become qualified', 'My long-term goal is to become qualified', 'Long-term goal become qualified is'], correctIndex: 1 },
  { id: 'mock-b1-3', question: 'How do you feel about the healthcare system here?', options: ['I have a lot of confidence in it', 'I have lot confidence it', 'Confidence I have lot in it'], correctIndex: 0 },
  { id: 'mock-b1-4', question: 'Can you explain how you applied for your visa extension?', options: ['The first step is to check eligibility, then you submit documents', 'First step check eligibility then documents submit', 'Check eligibility documents submit first'], correctIndex: 0 },
  { id: 'mock-b1-5', question: 'What would you do if you disagreed with a decision at work?', options: ["I'd raise it with my manager to clarify things", 'I raise with manager clarify', 'Would raise manager clarify'], correctIndex: 0 },
  { id: 'mock-b1-6', question: 'Are you involved in your local community?', options: ["Yes, I'm involved in the community garden", 'Yes I involved community garden', 'Involved yes garden community'], correctIndex: 0 },
  { id: 'mock-b1-7', question: 'What was one of the biggest challenges you\'ve faced?', options: ['I struggled with the language at first, but improved over time', 'Struggled language first improved time', 'Language struggled at improve'], correctIndex: 0 },
  { id: 'mock-b1-8', question: 'Why is voting important to you?', options: ['Because it affects local services we all use', 'Because affects services all use', 'Affects services because vote'], correctIndex: 0 },
  { id: 'mock-b1-9', question: 'How do you try to reduce your environmental impact?', options: ['We try to reduce our carbon footprint by cycling', 'We try reduce carbon footprint cycling', 'Reduce footprint we cycling try'], correctIndex: 0 },
  { id: 'mock-b1-10', question: 'What is the Life in the UK Test?', options: ['A test on British history, culture and society', 'A driving test for new residents', 'An English writing test'], correctIndex: 0 },
  { id: 'mock-b1-11', question: 'Why did you choose to volunteer at a food bank?', options: ['I like giving something back to the community', 'I like give back something community', 'Give back like community something'], correctIndex: 0 },
  { id: 'mock-b1-12', question: 'How has your view of the news changed recently?', options: ["It's been widely reported that prices have gone up, and it affects many people", 'Widely reported prices up affects people', 'Prices reported up affects widely'], correctIndex: 0 },
  { id: 'mock-b1-13', question: 'What would you say are your civic responsibilities?', options: ['Obeying the law, paying taxes, and voting', 'Obey law pay tax vote', 'Law taxes voting obey'], correctIndex: 0 },
  { id: 'mock-b1-14', question: 'Looking back, was moving here the right choice?', options: ['Looking back, it was the right choice for our family', 'Looking back right choice family', 'Right choice looking back family our'], correctIndex: 0 },
  { id: 'mock-b1-15', question: 'What differences have you noticed since moving here?', options: ["One thing I've noticed is how punctual people are", 'One thing notice punctual people are', 'Notice punctual people one thing'], correctIndex: 0 },
];

// Listening bank — the "question" is what gets spoken aloud (via
// text-to-speech); the learner picks the correct written answer without
// seeing the question text until they choose to reveal it.
export const LISTENING_BANK_A1: QuizQuestion[] = [
  { id: 'listen-1', question: "What time is your appointment?", options: ['Tuesday', "Two o'clock", 'London'], correctIndex: 1 },
  { id: 'listen-2', question: 'Where do you live?', options: ['I live in Manchester', 'I am fine, thank you', 'It costs ten pounds'], correctIndex: 0 },
  { id: 'listen-3', question: 'How many children do you have?', options: ['I have two children', 'I live in London', "It's sunny today"], correctIndex: 0 },
  { id: 'listen-4', question: "What's the weather like today?", options: ['My name is Sarah', "It's cold and rainy", 'I work as a nurse'], correctIndex: 1 },
  { id: 'listen-5', question: 'Turn left at the corner. Where should you turn?', options: ['Left', 'Right', 'Straight on'], correctIndex: 0 },
  { id: 'listen-6', question: 'The shop closes at half past five. What time does it close?', options: ['5:15', '5:30', '5:50'], correctIndex: 1 },
  { id: 'listen-7', question: 'What do you do for work?', options: ['I work as a teacher', 'I live near the station', 'I have three brothers'], correctIndex: 0 },
  { id: 'listen-8', question: 'Your appointment is on the 9th of July. Which date is it?', options: ['9 June', '9 July', '19 July'], correctIndex: 1 },
  { id: 'listen-9', question: 'How much does the ticket cost?', options: ['It costs five pounds', 'It takes five minutes', 'It closes at five'], correctIndex: 0 },
  { id: 'listen-10', question: "What's your favourite food?", options: ['My favourite food is rice', 'My favourite colour is blue', 'My favourite day is Monday'], correctIndex: 0 },
];

// A2 — sentences describing a situation, testing comprehension of longer,
// more detailed spoken information than A1.
export const LISTENING_BANK_A2: QuizQuestion[] = [
  { id: 'listen-a2-1', question: 'The appointment has been moved from Tuesday to Thursday. Which day is the new appointment?', options: ['Tuesday', 'Wednesday', 'Thursday'], correctIndex: 2 },
  { id: 'listen-a2-2', question: 'I used to live in Leeds, but I moved to Bristol two years ago. Where does the speaker live now?', options: ['Leeds', 'Bristol', 'London'], correctIndex: 1 },
  { id: 'listen-a2-3', question: 'The delivery was supposed to arrive yesterday, but it\'s been delayed until Friday. When will it arrive?', options: ['Yesterday', 'Today', 'Friday'], correctIndex: 2 },
  { id: 'listen-a2-4', question: 'I\'d prefer the smaller flat because it\'s cheaper, even though the bigger one has a garden. Which flat does the speaker prefer?', options: ['The smaller flat', 'The bigger flat', 'Neither flat'], correctIndex: 0 },
  { id: 'listen-a2-5', question: 'The train was cancelled, so I had to take the bus instead, which took much longer. How did the speaker actually travel?', options: ['By train', 'By bus', 'By car'], correctIndex: 1 },
  { id: 'listen-a2-6', question: 'I\'ve been working here for three years, but I only started this particular role last month. How long in the current role?', options: ['Three years', 'One month', 'One year'], correctIndex: 1 },
  { id: 'listen-a2-7', question: 'The shop is normally open until six, but on Sundays it closes at four. What time does it close on a Sunday?', options: ['Four', 'Six', 'Ten'], correctIndex: 0 },
  { id: 'listen-a2-8', question: 'If it rains tomorrow, we\'ll stay home; if it\'s sunny, we\'ll go to the park. What happens if it\'s sunny?', options: ['Stay home', 'Go to the park', 'Go to work'], correctIndex: 1 },
];

// B1 — requires following reasoning and multi-part information, not just a
// single fact, matching the more extended discourse expected at this level.
export const LISTENING_BANK_B1: QuizQuestion[] = [
  { id: 'listen-b1-1', question: 'I originally applied for the standard service, but I later upgraded to priority once I realised the deadline was tighter than I thought. Which service did the speaker end up using?', options: ['Standard', 'Priority', 'Neither'], correctIndex: 1 },
  { id: 'listen-b1-2', question: 'Although the course is quite expensive, I think it\'s worth it because it will open up better job opportunities in the long run. What is the speaker\'s overall opinion of the course?', options: ['Not worth the money', 'Worth it despite the cost', 'Too difficult to complete'], correctIndex: 1 },
  { id: 'listen-b1-3', question: 'We considered moving to a bigger city for work, but in the end we decided to stay here because of the children\'s school and our close friends nearby. Why did they stay?', options: ['Better job offers', 'School and friends', 'Cheaper housing'], correctIndex: 1 },
  { id: 'listen-b1-4', question: 'The council originally planned to close the library, but after residents raised concerns, they decided to reduce its opening hours instead. What actually happened to the library?', options: ['It closed completely', 'Its hours were reduced', 'Nothing changed'], correctIndex: 1 },
  { id: 'listen-b1-5', question: 'I\'ve applied for settlement twice before — the first time I was missing a document, and the second time I made a mistake on the form. What is different this time, according to the speaker?', options: ['Not stated directly, but implies more care this time', 'Nothing is different', 'They are not applying again'], correctIndex: 0 },
  { id: 'listen-b1-6', question: 'Even though I disagreed with the decision at first, after talking it through with my manager, I understood the reasoning behind it. How does the speaker feel now?', options: ['Still angry', 'Understands the decision now', 'Has quit the job'], correctIndex: 1 },
  { id: 'listen-b1-7', question: 'The Life in the UK Test covers British history, traditions, and how government works — most people prepare for around six to eight weeks before taking it. How long do most people prepare?', options: ['One week', 'Six to eight weeks', 'A full year'], correctIndex: 1 },
  { id: 'listen-b1-8', question: 'We used to recycle very little, but since the council introduced separate food waste collection, we\'ve become much more consistent about it. What changed their habits?', options: ['A new job', 'The council\'s food waste collection', 'Moving house'], correctIndex: 1 },
];

// Speaking Part 2 content — a short passage read aloud, followed by
// discussion questions the learner answers out loud (not multiple choice),
// mirroring the real exam's "listen, then discuss" structure.
export const LISTEN_DISCUSS_BANK_A1: ListenDiscussItem[] = [
  {
    id: 'discuss-doctor',
    title: "Booking a Doctor's Appointment",
    passage:
      'Hello, this is Green Street Surgery. If you would like to book an appointment, please call us between 8 AM and 6 PM, Monday to Friday. If it is an emergency, please call 999. Thank you.',
    followUpQuestions: [
      "Have you ever booked a doctor's appointment? How did you do it?",
      'What would you do if you felt very unwell at the weekend?',
      'Do you prefer to see the doctor in person or speak on the phone?',
    ],
  },
  {
    id: 'discuss-weather',
    title: 'A Weather Forecast',
    passage:
      'Good morning. Today will be cloudy with some rain in the afternoon. Temperatures will reach 15 degrees. Tomorrow will be sunnier, with a light breeze. Remember to bring an umbrella if you go out today.',
    followUpQuestions: [
      'What is the weather like today where you live?',
      'What is your favourite type of weather? Why?',
      'What clothes do you wear when it rains?',
    ],
  },
  {
    id: 'discuss-transport',
    title: 'Public Transport Announcement',
    passage:
      'The next train to London will depart from Platform 2 in five minutes. Please stand behind the yellow line. This train will stop at Manchester, Birmingham, and London Euston. Tickets can be bought from the machine or the ticket office.',
    followUpQuestions: [
      'How do you usually travel around your town?',
      'Have you ever taken a train? Tell me about it.',
      'What do you like or dislike about public transport?',
    ],
  },
  {
    id: 'discuss-supermarket',
    title: 'Opening Hours at the Supermarket',
    passage:
      "Our supermarket is open from 7 AM to 10 PM, Monday to Saturday, and from 10 AM to 4 PM on Sundays. We are closed on Christmas Day and New Year's Day. Thank you for shopping with us.",
    followUpQuestions: [
      'How often do you go shopping for food?',
      'Do you prefer shopping in a supermarket or a small local shop?',
      'What do you usually buy when you go shopping?',
    ],
  },
  {
    id: 'discuss-parcel',
    title: 'A Message About a Parcel',
    passage:
      'Hi, this is a message about your parcel. We tried to deliver it today, but nobody was home. We will try again tomorrow. If you would like to collect it instead, please visit the post office on Church Road.',
    followUpQuestions: [
      'Have you ever missed a delivery? What did you do?',
      'Do you prefer to shop online or in shops?',
      'How do you usually receive letters or parcels at home?',
    ],
  },
  {
    id: 'discuss-school',
    title: 'A School Message to Parents',
    passage:
      'Dear parents, please remember that school will close early on Friday at 1 PM for staff training. Please arrange to collect your children on time. Thank you for your understanding.',
    followUpQuestions: [
      'Do you have children at school? Tell me about their school.',
      'Who usually collects children from school in your family?',
      'What do you think is important about a good school?',
    ],
  },
];

// A2 — slightly longer passages with more detail than A1, mirroring the
// step up in listening length/complexity for the extension-stage test.
export const LISTEN_DISCUSS_BANK_A2: ListenDiscussItem[] = [
  {
    id: 'discuss-a2-council',
    title: 'A Council Announcement',
    passage:
      "Good afternoon. This is a message from the local council. From next month, bin collection days are changing in your area. General waste will now be collected on Mondays instead of Wednesdays, and recycling will move to Thursdays. If you have any questions, please visit our website or call the number on your council tax letter.",
    followUpQuestions: [
      'How do you usually find out about changes like this in your area?',
      'What do you think about the new collection days?',
      'Have you ever had a problem with bin collections? What happened?',
    ],
  },
  {
    id: 'discuss-a2-job-centre',
    title: 'A Job Centre Voicemail',
    passage:
      "Hello, this is a message from your local job centre. We received your application for the training course, and we'd like to invite you for a short interview next Tuesday at 10 AM. Please bring your ID and a copy of your CV. If this time doesn't work for you, please call us back to rearrange.",
    followUpQuestions: [
      'Have you ever applied for a training course or a new job recently?',
      'What would you do if the interview time didn\'t suit you?',
      'What documents do you think are important to bring to an interview?',
    ],
  },
  {
    id: 'discuss-a2-landlord',
    title: 'A Message From a Landlord',
    passage:
      "Hi, it's your landlord here. I wanted to let you know that a plumber will be coming to check the boiler this Friday between 9 and 11 in the morning. Someone needs to be home to let them in. If Friday doesn't work, let me know and we can arrange another day.",
    followUpQuestions: [
      'Have you ever had to arrange a repair in your home? What happened?',
      'What would you do if you couldn\'t be home on Friday?',
      'What do you think are a landlord\'s main responsibilities?',
    ],
  },
  {
    id: 'discuss-a2-gym',
    title: 'A Gym Membership Update',
    passage:
      "Thank you for being a member at Riverside Leisure Centre. We're writing to let you know that from the 1st of next month, our opening hours will change. We will now open an hour earlier on weekdays, at 6 AM, but will close earlier on Sundays, at 4 PM instead of 6 PM. We hope this suits more of our members.",
    followUpQuestions: [
      'Do you go to a gym or do any regular exercise? Tell me about it.',
      'What do you think about the new opening hours?',
      'How do you usually stay fit or active?',
    ],
  },
];

// B1 — longer, more detailed passages involving reasoning or multiple
// pieces of information, matching the real exam's step up in complexity.
export const LISTEN_DISCUSS_BANK_B1: ListenDiscussItem[] = [
  {
    id: 'discuss-b1-community-meeting',
    title: 'A Community Meeting Announcement',
    passage:
      "Good evening, everyone. I'm writing to invite you to our community meeting next Wednesday at 7 PM at the community centre on Park Road. We'll be discussing the council's proposal to build a new car park on the green space behind the shops. Some residents are in favour, as parking has become difficult, while others are concerned about losing one of the few green areas nearby. We'd really like to hear your views before the council makes a final decision next month.",
    followUpQuestions: [
      'What do you think about turning green spaces into car parks?',
      'Have you ever attended a community meeting or got involved in a local decision?',
      'How do you think councils should balance different residents\' opinions?',
    ],
  },
  {
    id: 'discuss-b1-college-course',
    title: 'A College Course Information Line',
    passage:
      "Thank you for calling about our evening courses. We currently have two options that might suit you: a one-year part-time course in business administration, held two evenings a week, or a more intensive six-month course covering the same material but with classes three evenings a week plus some Saturday sessions. Both lead to the same qualification, but the intensive option is better suited to those who want to finish more quickly, while the standard option gives more time to balance study with work and family commitments.",
    followUpQuestions: [
      'Which of these two options would suit you better, and why?',
      'What are the challenges of studying while working or raising a family?',
      'Do you think it\'s important to keep learning as an adult? Why?',
    ],
  },
  {
    id: 'discuss-b1-nhs-appointment',
    title: 'An NHS Service Update',
    passage:
      "This message is to inform patients registered at Elmwood Surgery about a change to our appointment system. From next month, routine appointments will need to be booked at least two weeks in advance through our new online booking system, rather than by phone. Urgent same-day appointments will still be available by calling the surgery directly before 10 AM. We understand this is a change for many patients, especially those less familiar with using computers, and staff will be available to help anyone who needs support registering for the new system.",
    followUpQuestions: [
      'What do you think about healthcare services moving online?',
      'Would a change like this be difficult for you or someone you know? Why?',
      'What could the surgery do to support patients who struggle with the new system?',
    ],
  },
  {
    id: 'discuss-b1-citizenship-ceremony',
    title: 'Information About a Citizenship Ceremony',
    passage:
      "Congratulations again on the approval of your citizenship application. Your citizenship ceremony has now been scheduled for the 15th of next month at the town hall. You'll need to arrive thirty minutes early, bring valid photo ID, and be prepared to make the Oath or Affirmation of Allegiance, followed by the Pledge. Ceremonies usually last around thirty minutes, and you're welcome to invite up to three guests. Please confirm your attendance and the number of guests at least one week before the date.",
    followUpQuestions: [
      'How do you imagine you would feel at a citizenship ceremony?',
      'Why do you think ceremonies like this are important to some people?',
      'Who would you want to invite if you attended a ceremony like this?',
    ],
  },
];

export interface CommonQuestion {
  question: string;
  exampleAnswer: string;
}

export interface CommonQuestionCategory {
  key: string;
  label: string;
  questions: CommonQuestion[];
}

export const COMMON_QUESTIONS_A1: CommonQuestionCategory[] = [
  {
    key: 'personal',
    label: 'Personal Information',
    questions: [
      { question: "What's your full name?", exampleAnswer: 'My name is Fatima Ahmed.' },
      { question: 'How old are you?', exampleAnswer: 'I am 29 years old.' },
      { question: "What's your date of birth?", exampleAnswer: 'My date of birth is the 3rd of May, 1996.' },
      { question: "What's your nationality?", exampleAnswer: 'I am Pakistani.' },
      { question: "What's your address?", exampleAnswer: 'I live at 24 Green Street, Manchester.' },
      { question: "What's your phone number?", exampleAnswer: "It's 07123 456789." },
      { question: 'How long have you lived at your current address?', exampleAnswer: 'I have lived there for two years.' },
      { question: 'Where were you born?', exampleAnswer: 'I was born in Lahore, Pakistan.' },
    ],
  },
  {
    key: 'family',
    label: 'Family',
    questions: [
      { question: 'Are you married?', exampleAnswer: 'Yes, I am married.' },
      { question: 'Tell me about your husband.', exampleAnswer: 'My husband is called Ahmed. He works as an engineer.' },
      { question: 'Tell me about your wife.', exampleAnswer: 'My wife is called Maria. She works as a teacher.' },
      { question: 'How many children do you have?', exampleAnswer: 'I have two children, a son and a daughter.' },
      { question: 'How many brothers and sisters do you have?', exampleAnswer: 'I have one brother and two sisters.' },
      { question: 'Do your parents live with you?', exampleAnswer: 'No, my parents live in my home country.' },
      { question: 'Tell me about your family.', exampleAnswer: 'I have a small family — my husband, our two children, and me.' },
      { question: 'Who do you live with?', exampleAnswer: 'I live with my husband and our children.' },
    ],
  },
  {
    key: 'home_daily_life',
    label: 'Home & Daily Life',
    questions: [
      { question: 'Can you describe your house?', exampleAnswer: 'I live in a flat with two bedrooms and a small kitchen.' },
      { question: 'How many rooms does your house have?', exampleAnswer: 'It has four rooms — two bedrooms, a kitchen, and a living room.' },
      { question: 'What do you usually do in the morning?', exampleAnswer: 'I usually wake up at seven, have breakfast, and get ready for work.' },
      { question: 'What time do you usually wake up?', exampleAnswer: 'I usually wake up at half past six.' },
      { question: 'What did you do last weekend?', exampleAnswer: 'I visited my family and cooked dinner for them.' },
      { question: 'What do you usually do in the evening?', exampleAnswer: 'I usually cook dinner and watch television.' },
      { question: 'How do you travel to the shops?', exampleAnswer: 'I usually walk, but sometimes I go by bus.' },
      { question: 'What do you usually eat for dinner?', exampleAnswer: 'I usually eat rice and chicken curry.' },
    ],
  },
  {
    key: 'work_study',
    label: 'Work & Study',
    questions: [
      { question: 'Where do you work?', exampleAnswer: 'I work in a hospital in Manchester.' },
      { question: 'What do you do for work?', exampleAnswer: 'I work as a nurse.' },
      { question: 'Do you work full-time or part-time?', exampleAnswer: 'I work full-time, five days a week.' },
      { question: 'Did you study at school or university?', exampleAnswer: 'I studied at university in my home country.' },
      { question: 'What did you study?', exampleAnswer: 'I studied business management.' },
      { question: 'Are you currently working?', exampleAnswer: 'No, I am not currently working.' },
      { question: 'What was your last job?', exampleAnswer: 'My last job was as a shop assistant.' },
    ],
  },
  {
    key: 'opinions_preferences',
    label: 'Opinions & Preferences',
    questions: [
      { question: "What's your favourite food?", exampleAnswer: 'My favourite food is chicken curry.' },
      { question: "What's your favourite hobby?", exampleAnswer: 'My favourite hobby is reading.' },
      { question: 'What do you like to do in your free time?', exampleAnswer: 'I like cooking and spending time with my family.' },
      { question: 'Do you prefer tea or coffee?', exampleAnswer: 'I prefer tea.' },
      { question: 'What kind of music do you like?', exampleAnswer: 'I like classical music.' },
      { question: 'Do you like cooking?', exampleAnswer: 'Yes, I really enjoy cooking.' },
    ],
  },
  {
    key: 'uk_related',
    label: 'About the UK',
    questions: [
      { question: 'Why do you want to live in the UK?', exampleAnswer: 'I want to live with my husband, who works in the UK.' },
      { question: 'Have you been to the UK before?', exampleAnswer: 'Yes, I visited London last year.' },
      { question: 'What do you know about the town or city you will live in?', exampleAnswer: 'I know that Manchester is a large city with good transport links.' },
      { question: 'How will you travel around in the UK?', exampleAnswer: 'I will travel by bus and train.' },
      { question: 'What are you looking forward to about living in the UK?', exampleAnswer: 'I am looking forward to starting my new life with my family.' },
    ],
  },
];

// A2 — questions expect a reason or a bit more detail in the answer, not
// just a fact, matching the extension-stage step up in complexity.
export const COMMON_QUESTIONS_A2: CommonQuestionCategory[] = [
  {
    key: 'life_here_so_far',
    label: 'Your Life Here So Far',
    questions: [
      { question: 'How long have you lived in the UK?', exampleAnswer: "I've been living here for two and a half years." },
      { question: 'What was the biggest change for you when you arrived?', exampleAnswer: 'The biggest change was getting used to the weather and the working hours.' },
      { question: 'Has your English improved since you arrived? How?', exampleAnswer: "Yes, it has — I've improved a lot by speaking with colleagues at work." },
      { question: 'What do you miss most about your home country?', exampleAnswer: 'I miss the food and being close to my parents.' },
      { question: 'What do you like most about living here?', exampleAnswer: "I like that it's well connected — I can travel easily by train." },
    ],
  },
  {
    key: 'work_and_routine',
    label: 'Work and Routine',
    questions: [
      { question: 'How has your daily routine changed since you started working here?', exampleAnswer: "It's changed a lot — I now commute by train, which takes about forty minutes." },
      { question: 'What do you think about your current job?', exampleAnswer: "I enjoy it, in my opinion it's a good balance between challenging and manageable." },
      { question: 'Have you had to adapt to a different way of working?', exampleAnswer: "Yes, I've had to adapt to meetings being much more direct than back home." },
      { question: 'What would you like to change about your job?', exampleAnswer: "I'd like to have a bit more flexibility with my hours." },
    ],
  },
  {
    key: 'plans_and_changes',
    label: 'Plans and Changes',
    questions: [
      { question: 'Why are you applying to extend your visa?', exampleAnswer: "I'm applying to extend my visa because I want to continue building my life here with my family." },
      { question: 'What are your plans for the next couple of years?', exampleAnswer: "In the next few years, I'm planning on improving my qualifications and finding a more senior role." },
      { question: 'Has anything changed in your family circumstances recently?', exampleAnswer: 'Yes, we recently had a second child, so our routine has changed quite a bit.' },
      { question: 'Do you think you\'ll stay in this area long-term?', exampleAnswer: 'I think so — it depends on work, but we\'re happy here for now.' },
    ],
  },
  {
    key: 'opinions_and_comparisons',
    label: 'Opinions and Comparisons',
    questions: [
      { question: 'What do you think is different about daily life here compared to your home country?', exampleAnswer: 'One thing I\'ve noticed is that people queue much more here than back home.' },
      { question: 'Do you prefer living in a city or a smaller town? Why?', exampleAnswer: 'I prefer a smaller town — it\'s quieter and the community feels friendlier.' },
      { question: 'What\'s something you had to get used to here?', exampleAnswer: 'The public transport system took some getting used to, but now I find it easy.' },
      { question: 'How do you think your English has helped you settle in?', exampleAnswer: "It's helped a lot — I feel much more confident dealing with everyday situations now." },
    ],
  },
];

// B1 — questions expect a fuller, more considered answer explaining
// reasoning, drawing on abstract or civic topics as well as personal ones.
export const COMMON_QUESTIONS_B1: CommonQuestionCategory[] = [
  {
    key: 'settling_and_belonging',
    label: 'Settling and Belonging',
    questions: [
      { question: 'Why are you applying for settlement (ILR)?', exampleAnswer: "I'm applying for settlement because this is where my family and my life are now — it feels like home." },
      { question: 'What does living in the UK long-term mean to you?', exampleAnswer: 'It means a lot to me — it represents stability and a future for my children.' },
      { question: 'How would you describe your sense of belonging here?', exampleAnswer: "I'd say I have a real sense of belonging now, especially through my local community." },
      { question: 'What have you done to become part of your local community?', exampleAnswer: "I'm involved in the community garden, and I've got to know a lot of neighbours through it." },
    ],
  },
  {
    key: 'civic_life',
    label: 'Civic Life',
    questions: [
      { question: 'What do you think are the main responsibilities of living in the UK?', exampleAnswer: 'I\'d say obeying the law, paying taxes, and voting when you\'re eligible are the main ones.' },
      { question: 'Why do you think voting in local elections is important?', exampleAnswer: 'Because it affects local services that we all rely on, like schools and bin collection.' },
      { question: 'Have you ever volunteered or been involved in a community project?', exampleAnswer: 'Yes, I volunteer at a food bank most Saturdays — it\'s really rewarding.' },
      { question: 'What do you know about how local government works here?', exampleAnswer: 'I know the local council is responsible for services like bins, roads, and libraries, and it\'s run by elected councillors.' },
    ],
  },
  {
    key: 'reflecting_on_the_journey',
    label: 'Reflecting on the Journey',
    questions: [
      { question: 'Looking back, what has been the biggest challenge since you arrived?', exampleAnswer: 'I struggled with the language at first, but over time I managed to build my confidence a lot.' },
      { question: 'What are you most proud of since moving here?', exampleAnswer: "I'm proud of how far I've come — building a career and a home here wasn't easy." },
      { question: 'How have your priorities changed since you first arrived?', exampleAnswer: 'At first it was just about finding work, but now I think more about long-term goals, like further study.' },
      { question: 'What advice would you give someone just starting this process?', exampleAnswer: 'I\'d say be patient — it took some getting used to, but it gets easier with time.' },
    ],
  },
  {
    key: 'citizenship_and_the_future',
    label: 'Citizenship and the Future',
    questions: [
      { question: 'Are you planning to apply for citizenship? Why or why not?', exampleAnswer: "Yes, eventually — it feels like the natural next step and it means a lot to me and my family." },
      { question: 'What do you know about the Life in the UK Test?', exampleAnswer: 'I know it\'s a separate test on British history, traditions and how government works, needed alongside the English requirement.' },
      { question: 'What does becoming a citizen represent to you?', exampleAnswer: "It represents a real commitment to this country — it feels like a new chapter for our family." },
      { question: 'What are your long-term goals here?', exampleAnswer: "My long-term goal is to build a stable career and eventually help my children through further education here." },
    ],
  },
];

export interface PracticeDay {
  day: number;
  title: string;
  description: string;
}

export const PRACTICE_PLAN: PracticeDay[] = [
  { day: 1, title: '10 Questions', description: 'Warm up with 10 mock test questions.' },
  { day: 2, title: '15 Questions', description: 'Build on yesterday with 15 mock test questions.' },
  { day: 3, title: 'Mock Test', description: 'Take a full mock test to check your progress.' },
  { day: 4, title: 'Speaking Practice', description: 'Read through the Common Questions bank and say your answers aloud.' },
  { day: 5, title: 'Listening Practice', description: 'Complete a listening practice session.' },
  { day: 6, title: 'Review a Lesson', description: 'Revisit a lesson from Learn, focusing on your weakest topic.' },
  { day: 7, title: 'Light Review', description: 'Skim your weak topics and common questions — keep it relaxed before starting the cycle again.' },
];

export interface ExamTip {
  title: string;
  body: string;
}

// Logistics only — the exam format itself (length, structure, what's
// assessed) lives on the Test Overview screen, not duplicated here.
export const EXAM_DAY_TIPS: ExamTip[] = [
  {
    title: 'What to bring',
    body:
      'Bring the exact same original, valid ID document you used when booking — no photocopies and no expired documents. If the Home Office has your passport, bring a valid EU identity card or Biometric Residence Permit instead.',
  },
  {
    title: 'On the day',
    body:
      'Arrive on time — if you\'re late you may not be allowed to take the test. Switch off your phone and other electronics and leave personal items outside the test room. Only water in a clear bottle is allowed inside. Staff will take your photo for your Test Report Form.',
  },
  {
    title: 'Common mistakes to avoid',
    body:
      "Turning up with an expired or photocopied ID, arriving late, and bringing food, drink (other than water), or a phone into the test room are the most common reasons applicants run into problems on the day.",
  },
  {
    title: "What happens if you don't pass",
    body:
      "IELTS Life Skills is pass/fail, not a band score. If you don't pass, there's no restriction on retaking the test — you'll need to pass it before your visa application can rely on it. A pass is valid for 2 years from your test date.",
  },
];

// Per-level lookup maps — the screen reads these by the currently selected
// CEFRLevel rather than importing each level's bank directly, so switching
// levels is a single lookup rather than a chain of conditionals.
export const MOCK_TEST_BANKS: Record<CEFRLevel, QuizQuestion[]> = {
  a1: MOCK_TEST_BANK_A1,
  a2: MOCK_TEST_BANK_A2,
  b1: MOCK_TEST_BANK_B1,
};

export const LISTENING_BANKS: Record<CEFRLevel, QuizQuestion[]> = {
  a1: LISTENING_BANK_A1,
  a2: LISTENING_BANK_A2,
  b1: LISTENING_BANK_B1,
};

export const LISTEN_DISCUSS_BANKS: Record<CEFRLevel, ListenDiscussItem[]> = {
  a1: LISTEN_DISCUSS_BANK_A1,
  a2: LISTEN_DISCUSS_BANK_A2,
  b1: LISTEN_DISCUSS_BANK_B1,
};

export const COMMON_QUESTIONS_BY_LEVEL: Record<CEFRLevel, CommonQuestionCategory[]> = {
  a1: COMMON_QUESTIONS_A1,
  a2: COMMON_QUESTIONS_A2,
  b1: COMMON_QUESTIONS_B1,
};

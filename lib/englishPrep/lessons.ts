import { Lesson } from './types';
import { CEFRLevel } from './level';

// A1 — everyday, familiar-topic vocabulary for an initial family visa
// applicant. Kept exactly as it was before A2/B1 were added.
export const LESSONS_A1: Lesson[] = [
  {
    key: 'greetings',
    icon: 'smile',
    title: 'Greetings',
    vocabulary: [
      { word: 'Hello / Hi', meaning: 'A friendly way to say hello', example: 'Hello, how are you?' },
      { word: 'Good morning', meaning: 'Said before midday', example: 'Good morning, everyone.' },
      { word: 'Good afternoon', meaning: 'Said from midday to evening', example: 'Good afternoon, nice to see you.' },
      { word: 'Good evening', meaning: 'Said in the evening', example: 'Good evening, welcome.' },
      { word: 'How are you?', meaning: 'A question asking about someone\'s wellbeing', example: 'Hi Sarah, how are you?' },
      { word: 'Nice to meet you', meaning: 'Said when meeting someone for the first time', example: 'Nice to meet you, I\'m John.' },
    
      { word: 'Good night', meaning: 'Said when leaving at night or before sleep', example: 'Good night, see you tomorrow.' },
      { word: 'How do you do?', meaning: 'A formal greeting when meeting someone', example: 'How do you do? Pleased to meet you.' },
      { word: 'Long time no see', meaning: 'Said to someone you have not seen for a while', example: 'Hi! Long time no see.' },
    ],
    pronunciationTip:
      'Stress the first part of "HEL-lo" and "MOR-ning". Keep greetings short and friendly — a smile and eye contact matter as much as the words.',
    conversation: [
      { speaker: 'A', line: 'Good morning! How are you today?' },
      { speaker: 'B', line: "I'm fine, thank you. And you?" },
      { speaker: 'A', line: "I'm well, thanks. Nice to meet you." },
      { speaker: 'B', line: 'Nice to meet you too.' },
    ],
    quiz: [
      { id: 'greetings-1', question: 'What do you say to someone in the morning?', options: ['Good night', 'Good morning', 'Goodbye'], correctIndex: 1 },
      { id: 'greetings-2', question: 'Someone says "How are you?" — what is a good reply?', options: ['I am Ahmed', "I'm fine, thank you", 'Yes please'], correctIndex: 1 },
      { id: 'greetings-3', question: 'What do you say when you meet someone for the first time?', options: ['Nice to meet you', 'See you later', 'Good night'], correctIndex: 0 },
    ],
  },
  {
    key: 'introducing_yourself',
    icon: 'user',
    title: 'Introducing Yourself',
    vocabulary: [
      { word: 'My name is...', meaning: 'Used to tell someone your name', example: 'My name is Fatima.' },
      { word: 'I am from...', meaning: 'Used to say your country', example: 'I am from Nigeria.' },
      { word: 'I live in...', meaning: 'Used to say where you live', example: 'I live in Manchester.' },
      { word: 'I am ... years old', meaning: 'Used to say your age', example: 'I am 28 years old.' },
      { word: 'married / single', meaning: 'Your relationship status', example: 'I am married.' },
    
      { word: 'This is...', meaning: 'Used to introduce another person', example: 'This is my friend, Maria.' },
      { word: "What's your name?", meaning: "A question asking someone's name", example: "What's your name?" },
      { word: 'I work as a...', meaning: 'Introducing your job', example: 'I work as a driver.' },
    ],
    pronunciationTip:
      'Say "My name IS" clearly with the "is" — many learners skip it and say "My name Ahmed", which sounds incomplete in English.',
    conversation: [
      { speaker: 'Examiner', line: "What's your name?" },
      { speaker: 'You', line: 'My name is Ahmed.' },
      { speaker: 'Examiner', line: 'Where are you from?' },
      { speaker: 'You', line: 'I am from Pakistan.' },
      { speaker: 'Examiner', line: 'How old are you?' },
      { speaker: 'You', line: 'I am 32 years old.' },
    ],
    quiz: [
      { id: 'intro-1', question: 'How do you correctly say your name?', options: ['My name Ahmed', 'My name is Ahmed', 'I Ahmed'], correctIndex: 1 },
      { id: 'intro-2', question: 'How do you say where you live?', options: ['I live in London', 'I living London', 'Live London'], correctIndex: 0 },
      { id: 'intro-3', question: 'Which sentence is correct?', options: ['I am 30 years', 'I 30 years old', 'I am 30 years old'], correctIndex: 2 },
    ],
  },
  {
    key: 'family',
    icon: 'users',
    title: 'Family',
    vocabulary: [
      { word: 'husband / wife', meaning: 'Your spouse', example: 'This is my husband, Tom.' },
      { word: 'son / daughter', meaning: 'Your child', example: 'I have a daughter and a son.' },
      { word: 'brother / sister', meaning: 'Your sibling', example: 'I have two brothers.' },
      { word: 'mother / father', meaning: 'Your parents', example: 'My mother lives in Egypt.' },
      { word: 'children', meaning: 'More than one child', example: 'I have three children.' },
    
      { word: 'grandmother / grandfather', meaning: "Your parent's parent", example: 'My grandmother lives with us.' },
      { word: 'aunt / uncle', meaning: "Your parent's sibling", example: 'My uncle visits every summer.' },
      { word: 'cousin', meaning: 'The child of your aunt or uncle', example: 'I have five cousins.' },
    ],
    pronunciationTip:
      'Practise the "th" sound in "mother", "father", and "brother" — put your tongue lightly between your teeth.',
    conversation: [
      { speaker: 'Examiner', line: 'Tell me about your family.' },
      { speaker: 'You', line: 'I am married. I have two children, a son and a daughter.' },
      { speaker: 'Examiner', line: 'Do you have brothers or sisters?' },
      { speaker: 'You', line: 'Yes, I have one brother and one sister.' },
    ],
    quiz: [
      { id: 'family-1', question: 'How many brothers and sisters do you have? A good answer is:', options: ['I have brother two', 'I have two brothers and one sister', 'Brothers two have I'], correctIndex: 1 },
      { id: 'family-2', question: 'What do you call your husband\'s or wife\'s parent-child?', options: ['son or daughter', 'brother', 'friend'], correctIndex: 0 },
      { id: 'family-3', question: 'Which word means "not married"?', options: ['Married', 'Single', 'Family'], correctIndex: 1 },
    ],
  },
  {
    key: 'numbers',
    icon: 'hash',
    title: 'Numbers',
    vocabulary: [
      { word: 'one, two, three...', meaning: 'Counting numbers 1-20', example: 'I have three children.' },
      { word: 'ten, twenty, thirty...', meaning: 'Counting in tens', example: 'I am thirty years old.' },
      { word: 'first, second, third', meaning: 'Ordinal numbers', example: 'This is my first visit.' },
      { word: 'a phone number', meaning: 'A number to call someone', example: 'My phone number is 07123 456789.' },
    
      { word: 'hundred / thousand', meaning: 'Larger numbers', example: 'It costs one hundred pounds.' },
      { word: 'How many...?', meaning: 'Asking about a quantity', example: 'How many children do you have?' },
      { word: 'a few / a lot', meaning: 'Approximate amounts', example: 'I have a few questions.' },
    ],
    pronunciationTip:
      'Watch the stress difference between "thirteen" (13, stress on -TEEN) and "thirty" (30, stress on THIR-).',
    conversation: [
      { speaker: 'Examiner', line: "What's your phone number?" },
      { speaker: 'You', line: "It's 07123 456789." },
      { speaker: 'Examiner', line: 'How many people are in your family?' },
      { speaker: 'You', line: 'There are four people — my husband, our two children, and me.' },
    ],
    quiz: [
      { id: 'numbers-1', question: 'Which number is "13"?', options: ['thirty', 'thirteen', 'third'], correctIndex: 1 },
      { id: 'numbers-2', question: 'Which is correct for "1st"?', options: ['one', 'first', 'once'], correctIndex: 1 },
      { id: 'numbers-3', question: 'How do you say "40"?', options: ['fourteen', 'fourth', 'forty'], correctIndex: 2 },
    ],
  },
  {
    key: 'dates',
    icon: 'calendar',
    title: 'Dates',
    vocabulary: [
      { word: 'today / tomorrow / yesterday', meaning: 'Time words for days', example: 'I arrived yesterday.' },
      { word: 'Monday, Tuesday...', meaning: 'Days of the week', example: 'My appointment is on Monday.' },
      { word: 'January, February...', meaning: 'Months of the year', example: 'My birthday is in July.' },
      { word: "What's the date today?", meaning: 'A question asking for the date', example: "Today is the 9th of July." },
    
      { word: 'this week / next week', meaning: 'Talking about upcoming time', example: 'My appointment is next week.' },
      { word: 'last month / last year', meaning: 'Talking about past time', example: 'I moved here last year.' },
      { word: 'weekday / weekend', meaning: 'Types of days', example: 'I work on weekdays.' },
    ],
    pronunciationTip:
      'For dates, say "the 9th of July" or "July the 9th" — both are correct and common in the UK.',
    conversation: [
      { speaker: 'Examiner', line: "What's the date today?" },
      { speaker: 'You', line: "Today is the 9th of July." },
      { speaker: 'Examiner', line: 'When is your birthday?' },
      { speaker: 'You', line: 'My birthday is in March.' },
    ],
    quiz: [
      { id: 'dates-1', question: 'Which is a day of the week?', options: ['July', 'Wednesday', 'Twelve'], correctIndex: 1 },
      { id: 'dates-2', question: 'Which is a month?', options: ['Sunday', 'September', 'Yesterday'], correctIndex: 1 },
      { id: 'dates-3', question: 'What do we call the day before today?', options: ['Tomorrow', 'Today', 'Yesterday'], correctIndex: 2 },
    ],
  },
  {
    key: 'time',
    icon: 'clock',
    title: 'Time',
    vocabulary: [
      { word: "What time is it?", meaning: 'Asking for the current time', example: "What time is it? It's two o'clock." },
      { word: "o'clock", meaning: 'Used for exact hours', example: "It's three o'clock." },
      { word: 'half past / quarter past', meaning: 'Common time expressions', example: "It's half past four." },
      { word: 'in the morning / afternoon / evening', meaning: 'Parts of the day', example: 'My appointment is at 2pm in the afternoon.' },
    
      { word: 'early / late', meaning: 'Before or after the expected time', example: "I don't want to be late." },
      { word: 'a moment / a minute', meaning: 'A short period of time', example: 'Wait a moment, please.' },
      { word: 'on time', meaning: 'Neither early nor late', example: 'The bus arrived on time.' },
    ],
    pronunciationTip:
      'Say times clearly, one part at a time: "two — thirty" rather than rushing "twothirty" together.',
    conversation: [
      { speaker: 'Examiner', line: "What time is your appointment?" },
      { speaker: 'You', line: "It's at two o'clock in the afternoon." },
      { speaker: 'Examiner', line: 'What time do you usually wake up?' },
      { speaker: 'You', line: 'I usually wake up at half past six.' },
    ],
    quiz: [
      { id: 'time-1', question: 'How do you say 3:00?', options: ["Three o'clock", 'Three half', 'Third o\'clock'], correctIndex: 0 },
      { id: 'time-2', question: 'What time is your appointment? A correct answer is:', options: ['Tuesday', "Two o'clock", 'London'], correctIndex: 1 },
      { id: 'time-3', question: 'Which means 4:30?', options: ['Quarter past four', 'Half past four', 'Quarter to four'], correctIndex: 1 },
    ],
  },
  {
    key: 'shopping',
    icon: 'shopping-bag',
    title: 'Shopping',
    vocabulary: [
      { word: 'How much is this?', meaning: 'Asking the price', example: 'How much is this jacket?' },
      { word: 'It costs...', meaning: 'Telling the price', example: 'It costs ten pounds.' },
      { word: 'receipt', meaning: 'Proof of purchase', example: 'Can I have a receipt, please?' },
      { word: 'cash / card', meaning: 'Ways to pay', example: 'Can I pay by card?' },
      { word: 'too expensive / cheap', meaning: 'Describing price', example: "That's too expensive for me." },
    
      { word: 'shopping list', meaning: 'A list of things to buy', example: "I've written a shopping list." },
      { word: 'bag / basket', meaning: 'For carrying purchases', example: 'Do you need a bag?' },
      { word: 'open / closed', meaning: 'Whether a shop is trading', example: 'The shop is closed on Sundays.' },
    ],
    pronunciationTip:
      'Practise "How much IS this?" with rising intonation at the end — that\'s how questions usually sound in English.',
    conversation: [
      { speaker: 'You', line: 'How much is this shirt?' },
      { speaker: 'Shop assistant', line: 'It costs fifteen pounds.' },
      { speaker: 'You', line: 'Can I pay by card?' },
      { speaker: 'Shop assistant', line: 'Yes, of course.' },
    ],
    quiz: [
      { id: 'shopping-1', question: 'How do you ask the price of something?', options: ['How much is this?', 'What is this?', 'Where is this?'], correctIndex: 0 },
      { id: 'shopping-2', question: 'Which word means "not expensive"?', options: ['Expensive', 'Cheap', 'Costly'], correctIndex: 1 },
      { id: 'shopping-3', question: 'What do you ask for after paying, to keep as proof?', options: ['A receipt', 'A ticket', 'A card'], correctIndex: 0 },
    ],
  },
  {
    key: 'food',
    icon: 'coffee',
    title: 'Food',
    vocabulary: [
      { word: 'breakfast / lunch / dinner', meaning: 'Meals of the day', example: 'I usually eat breakfast at 8am.' },
      { word: 'I like / I don\'t like', meaning: 'Expressing food preference', example: "I like rice, but I don't like spicy food." },
      { word: 'hungry / thirsty', meaning: 'Wanting food or drink', example: "I'm hungry, let's eat." },
      { word: 'favourite food', meaning: 'The food you like most', example: 'My favourite food is chicken curry.' },
    
      { word: 'vegetables / fruit', meaning: 'Healthy food groups', example: 'I eat a lot of vegetables.' },
      { word: 'meat / fish', meaning: 'Common protein foods', example: "I don't eat meat." },
      { word: 'spicy / sweet', meaning: 'Describing flavours', example: 'This food is very spicy.' },
    ],
    pronunciationTip:
      'The "f" in "favourite" is soft — bite your bottom lip gently against your top teeth to make the sound.',
    conversation: [
      { speaker: 'Examiner', line: "What's your favourite food?" },
      { speaker: 'You', line: 'My favourite food is rice and chicken.' },
      { speaker: 'Examiner', line: 'What did you eat for breakfast today?' },
      { speaker: 'You', line: 'I ate bread and eggs for breakfast.' },
    ],
    quiz: [
      { id: 'food-1', question: 'What is your favourite food? A correct answer is:', options: ['Favourite my food rice is', 'My favourite food is rice', 'I favourite rice food'], correctIndex: 1 },
      { id: 'food-2', question: 'Which meal do people usually eat in the morning?', options: ['Dinner', 'Breakfast', 'Lunch'], correctIndex: 1 },
      { id: 'food-3', question: 'What do you say if you want water?', options: ["I'm thirsty", "I'm hungry", "I'm tired"], correctIndex: 0 },
    ],
  },
  {
    key: 'directions',
    icon: 'compass',
    title: 'Directions',
    vocabulary: [
      { word: 'left / right', meaning: 'Directions', example: 'Turn left at the corner.' },
      { word: 'straight on', meaning: 'Continue forward', example: 'Go straight on for two minutes.' },
      { word: 'near / far', meaning: 'Distance words', example: 'The shop is near my house.' },
      { word: 'Where is...?', meaning: 'Asking for a location', example: 'Where is the bus stop?' },
    
      { word: 'opposite', meaning: 'Facing something, on the other side', example: 'The bank is opposite the shop.' },
      { word: 'next to / between', meaning: 'Describing position', example: 'The pharmacy is next to the bank.' },
      { word: 'Can you show me on the map?', meaning: 'Asking for a visual direction', example: 'Can you show me on the map, please?' },
    ],
    pronunciationTip:
      '"Left" and "right" can sound similar to new learners — exaggerate the "f" sound in "left" to make the difference clear.',
    conversation: [
      { speaker: 'You', line: 'Excuse me, where is the nearest supermarket?' },
      { speaker: 'Stranger', line: 'Go straight on, then turn right. It\'s near the pharmacy.' },
      { speaker: 'You', line: 'Thank you very much.' },
    ],
    quiz: [
      { id: 'directions-1', question: 'How do you ask for a location politely?', options: ['Where supermarket?', 'Where is the supermarket?', 'Supermarket where is?'], correctIndex: 1 },
      { id: 'directions-2', question: 'What does "straight on" mean?', options: ['Turn around', 'Continue forward', 'Stop here'], correctIndex: 1 },
      { id: 'directions-3', question: 'Which word means "not far"?', options: ['Near', 'Left', 'Straight'], correctIndex: 0 },
    ],
  },
  {
    key: 'jobs',
    icon: 'briefcase',
    title: 'Jobs',
    vocabulary: [
      { word: 'What do you do?', meaning: 'Asking about someone\'s job', example: 'What do you do for work?' },
      { word: 'I work as a...', meaning: 'Describing your job', example: 'I work as a nurse.' },
      { word: 'I am unemployed', meaning: 'Not currently working', example: 'I am unemployed at the moment.' },
      { word: 'full-time / part-time', meaning: 'How many hours you work', example: 'I work part-time.' },
    
      { word: 'colleague / manager', meaning: 'People you work with', example: 'My manager is helpful.' },
      { word: 'salary / wages', meaning: 'Money you earn from work', example: 'My salary is paid monthly.' },
      { word: 'retired', meaning: 'No longer working, usually due to age', example: 'My father is retired.' },
    ],
    pronunciationTip:
      'Stress the job title, not "work": "I work as a NURSE" — the important new information gets the stress.',
    conversation: [
      { speaker: 'Examiner', line: 'What do you do?' },
      { speaker: 'You', line: 'I work as a shop assistant.' },
      { speaker: 'Examiner', line: 'Do you work full-time?' },
      { speaker: 'You', line: 'Yes, I work full-time, five days a week.' },
    ],
    quiz: [
      { id: 'jobs-1', question: 'Where do you work? A correct answer is:', options: ['I work in a hospital', 'I in hospital work', 'Work hospital I'], correctIndex: 0 },
      { id: 'jobs-2', question: 'Which means you are not currently working?', options: ['Full-time', 'Unemployed', 'Manager'], correctIndex: 1 },
      { id: 'jobs-3', question: 'What is a good way to ask about someone\'s job?', options: ['What do you do?', 'How much do you have?', 'Where do you go?'], correctIndex: 0 },
    ],
  },
  {
    key: 'daily_routine',
    icon: 'sunrise',
    title: 'Daily Routine',
    vocabulary: [
      { word: 'wake up / get up', meaning: 'Starting your day', example: 'I wake up at 6am.' },
      { word: 'get dressed', meaning: 'Putting on clothes', example: 'I get dressed after breakfast.' },
      { word: 'go to work / school', meaning: 'Leaving for the day', example: 'I go to work at 8am.' },
      { word: 'go to bed', meaning: 'Ending your day', example: 'I go to bed at 10pm.' },
      { word: 'every day / usually', meaning: 'Talking about habits', example: 'I usually cook dinner every day.' },
    
      { word: 'have breakfast / lunch / dinner', meaning: 'Eating meals', example: 'I have breakfast at 7am.' },
      { word: 'brush your teeth', meaning: 'A daily hygiene habit', example: 'I brush my teeth twice a day.' },
      { word: 'take a shower', meaning: 'To wash yourself', example: 'I take a shower in the morning.' },
    ],
    pronunciationTip:
      'For routines, use "usually" or "every day" and the simple present tense: "I wake up", not "I am wake up".',
    conversation: [
      { speaker: 'Examiner', line: 'Can you describe your daily routine?' },
      { speaker: 'You', line: 'I wake up at 6am. I get dressed, then I go to work. I come home at 5pm and cook dinner.' },
    ],
    quiz: [
      { id: 'routine-1', question: 'Which sentence describes a routine correctly?', options: ['I usually wake up at 6am', 'I usually am wake up 6am', 'Wake I usually up 6am'], correctIndex: 0 },
      { id: 'routine-2', question: 'What do you do before you leave the house?', options: ['Go to bed', 'Get dressed', 'Sleep'], correctIndex: 1 },
      { id: 'routine-3', question: 'What is the opposite of "wake up"?', options: ['Get dressed', 'Go to bed', 'Go to work'], correctIndex: 1 },
    ],
  },
  {
    key: 'health',
    icon: 'activity',
    title: 'Health',
    vocabulary: [
      { word: "I don't feel well", meaning: 'Saying you are unwell', example: "I don't feel well today." },
      { word: 'headache / stomachache', meaning: 'Common pains', example: 'I have a headache.' },
      { word: 'doctor / appointment', meaning: 'Medical help', example: 'I have a doctor\'s appointment.' },
      { word: 'medicine', meaning: 'Treatment for illness', example: 'I need to take medicine.' },
    
      { word: 'allergy', meaning: 'A reaction to certain foods or substances', example: 'I have an allergy to nuts.' },
      { word: 'feel better', meaning: 'To feel less unwell', example: 'I hope you feel better soon.' },
      { word: 'blood pressure', meaning: 'A health measurement', example: 'The nurse checked my blood pressure.' },
    ],
    pronunciationTip:
      'The "ch" in "headache" is a hard "k" sound, not "ch" as in "chair" — it\'s pronounced "HED-ake".',
    conversation: [
      { speaker: 'You', line: "I don't feel well. I have a headache." },
      { speaker: 'Receptionist', line: 'Would you like to book a doctor\'s appointment?' },
      { speaker: 'You', line: 'Yes, please. Is tomorrow morning possible?' },
    ],
    quiz: [
      { id: 'health-1', question: 'How do you say you are unwell?', options: ["I don't feel well", 'I feel good', 'I am happy'], correctIndex: 0 },
      { id: 'health-2', question: 'Where do you go if you need medical help?', options: ['Shop', 'Doctor', 'School'], correctIndex: 1 },
      { id: 'health-3', question: 'What do you take when you are ill?', options: ['Medicine', 'Receipt', 'Appointment'], correctIndex: 0 },
    ],
  },
  {
    key: 'weather',
    icon: 'cloud',
    title: 'Weather',
    vocabulary: [
      { word: 'sunny / rainy / cloudy', meaning: 'Weather conditions', example: "It's rainy today." },
      { word: 'hot / cold / warm', meaning: 'Temperature words', example: "It's cold today." },
      { word: "What's the weather like?", meaning: 'Asking about the weather', example: "What's the weather like today?" },
      { word: 'umbrella / coat', meaning: 'Things for bad weather', example: 'Take an umbrella, it\'s raining.' },
    
      { word: 'windy / foggy', meaning: 'More weather conditions', example: "It's very windy today." },
      { word: "It's freezing", meaning: 'Saying it is very cold', example: "It's freezing outside." },
      { word: 'degrees', meaning: 'A unit of temperature', example: "It's ten degrees today." },
    ],
    pronunciationTip:
      'Practise "weather" (WEH-ther, with the soft "th") versus "whether" — they sound identical, so context matters.',
    conversation: [
      { speaker: 'Examiner', line: "What's the weather like today?" },
      { speaker: 'You', line: "It's cold and rainy today." },
      { speaker: 'Examiner', line: 'What do you wear when it rains?' },
      { speaker: 'You', line: 'I wear a coat and take an umbrella.' },
    ],
    quiz: [
      { id: 'weather-1', question: "What's the weather like today? A correct answer:", options: ["It's sunny today", 'Today sunny is', 'Weather sunny'], correctIndex: 0 },
      { id: 'weather-2', question: 'What do you take with you when it rains?', options: ['A coat', 'An umbrella', 'A receipt'], correctIndex: 1 },
      { id: 'weather-3', question: 'Which word describes very low temperature?', options: ['Hot', 'Warm', 'Cold'], correctIndex: 2 },
    ],
  },
  {
    key: 'colours',
    icon: 'droplet',
    title: 'Colours',
    vocabulary: [
      { word: 'red / blue / green', meaning: 'Common colours', example: 'I like the red jacket.' },
      { word: 'black / white / grey', meaning: 'Neutral colours', example: 'My car is grey.' },
      { word: 'yellow / orange / purple', meaning: 'More colours', example: 'She has a yellow umbrella.' },
      { word: "What colour is it?", meaning: 'Asking about colour', example: "What colour is your coat?" },
    
      { word: 'pink / brown', meaning: 'More colours', example: 'She has a pink bag.' },
      { word: 'light / dark', meaning: 'Describing colour shade', example: 'I prefer light colours.' },
      { word: 'My favourite colour is...', meaning: 'Saying which colour you like', example: 'My favourite colour is blue.' },
    ],
    pronunciationTip: 'The "ou" in "colour" sounds like "uh" — say "CUL-uh", not "coh-LOUR".',
    conversation: [
      { speaker: 'Shop assistant', line: 'What colour would you like?' },
      { speaker: 'You', line: "I'd like the blue one, please." },
      { speaker: 'Shop assistant', line: 'Here you are.' },
    ],
    quiz: [
      { id: 'colours-1', question: 'What colour is the sky on a clear day?', options: ['Green', 'Blue', 'Brown'], correctIndex: 1 },
      { id: 'colours-2', question: 'How do you ask about colour?', options: ['What colour is it?', 'How colour is it?', 'Colour what is?'], correctIndex: 0 },
      { id: 'colours-3', question: 'Which is a neutral colour?', options: ['Purple', 'Orange', 'Grey'], correctIndex: 2 },
    ],
  },
  {
    key: 'clothes',
    icon: 'tag',
    title: 'Clothes',
    vocabulary: [
      { word: 'shirt / trousers / dress', meaning: 'Common clothing items', example: "I'm wearing a blue shirt." },
      { word: 'shoes / socks', meaning: 'Footwear', example: 'My shoes are new.' },
      { word: 'jacket / coat', meaning: 'Outer clothing', example: 'Take a coat, it\'s cold.' },
      { word: "I'm wearing...", meaning: 'Describing what you have on', example: "I'm wearing a jacket today." },
    
      { word: 'skirt / jumper', meaning: 'More clothing items', example: "I'm wearing a warm jumper." },
      { word: 'hat / scarf', meaning: 'Accessories', example: "I need a hat, it's sunny." },
      { word: 'It suits you', meaning: 'A compliment about clothing', example: 'That colour really suits you.' },
    ],
    pronunciationTip: '"Clothes" is one syllable, sounding like "clohz" — many learners add an extra sound, but there is no "th-uz".',
    conversation: [
      { speaker: 'A', line: "What are you wearing today?" },
      { speaker: 'B', line: "I'm wearing a shirt and trousers." },
      { speaker: 'A', line: "It looks smart." },
    ],
    quiz: [
      { id: 'clothes-1', question: 'Which is footwear?', options: ['Shoes', 'Shirt', 'Coat'], correctIndex: 0 },
      { id: 'clothes-2', question: 'What do you wear when it is cold?', options: ['A coat', 'Shorts', 'Sandals'], correctIndex: 0 },
      { id: 'clothes-3', question: 'Which sentence is correct?', options: ["I wearing a shirt", "I'm wearing a shirt", "I wear a shirt am"], correctIndex: 1 },
    ],
  },
  {
    key: 'body_parts',
    icon: 'user',
    title: 'Parts of the Body',
    vocabulary: [
      { word: 'head / arm / leg', meaning: 'Main body parts', example: 'My head hurts.' },
      { word: 'hand / foot', meaning: 'End of arm / leg', example: 'I hurt my foot.' },
      { word: 'eyes / ears / mouth', meaning: 'Parts of the face', example: 'My ears hurt.' },
      { word: 'It hurts', meaning: 'Saying you have pain', example: 'My back hurts.' },
    
      { word: 'back / chest', meaning: 'More body parts', example: 'My back hurts.' },
      { word: 'finger / knee', meaning: 'Smaller body parts', example: 'I hurt my knee.' },
      { word: 'skin / hair', meaning: 'Parts covering the body', example: 'I have dry skin.' },
    ],
    pronunciationTip: '"Hurts" ends with a soft "ts" sound — say "hurts" quickly, not "hurt-uzz".',
    conversation: [
      { speaker: 'Doctor', line: 'What is the problem?' },
      { speaker: 'You', line: 'My leg hurts.' },
      { speaker: 'Doctor', line: 'Since when?' },
      { speaker: 'You', line: 'Since yesterday.' },
    ],
    quiz: [
      { id: 'body-1', question: 'Which part of the body do you use to see?', options: ['Ears', 'Eyes', 'Hands'], correctIndex: 1 },
      { id: 'body-2', question: 'How do you say a body part hurts?', options: ['It hurts', 'It hurt', 'Hurts it'], correctIndex: 0 },
      { id: 'body-3', question: 'Which is at the end of your leg?', options: ['Hand', 'Foot', 'Arm'], correctIndex: 1 },
    ],
  },
  {
    key: 'house_rooms',
    icon: 'home',
    title: 'Rooms in a House',
    vocabulary: [
      { word: 'kitchen / bathroom', meaning: 'Where you cook / wash', example: 'The kitchen is small.' },
      { word: 'bedroom / living room', meaning: 'Where you sleep / relax', example: 'I have two bedrooms.' },
      { word: 'garden', meaning: 'Outside space at a house', example: 'We have a small garden.' },
      { word: 'upstairs / downstairs', meaning: 'Which floor', example: 'The bathroom is upstairs.' },
    
      { word: 'hallway / stairs', meaning: 'Parts connecting rooms', example: 'Leave your shoes in the hallway.' },
      { word: 'window / door', meaning: 'Parts of a room', example: 'Please close the window.' },
      { word: 'How many rooms?', meaning: 'Asking about the size of a home', example: 'How many rooms does it have?' },
    ],
    pronunciationTip: 'Stress the first part: "KITCH-en", "BED-room" — most two-part house words stress the first word.',
    conversation: [
      { speaker: 'A', line: 'How many bedrooms does your house have?' },
      { speaker: 'B', line: 'It has three bedrooms and a small garden.' },
    ],
    quiz: [
      { id: 'house-1', question: 'Where do you cook?', options: ['Bedroom', 'Kitchen', 'Garden'], correctIndex: 1 },
      { id: 'house-2', question: 'Where do you sleep?', options: ['Bathroom', 'Bedroom', 'Kitchen'], correctIndex: 1 },
      { id: 'house-3', question: 'Which word means outside space at a house?', options: ['Garden', 'Living room', 'Upstairs'], correctIndex: 0 },
    ],
  },
  {
    key: 'furniture',
    icon: 'box',
    title: 'Furniture',
    vocabulary: [
      { word: 'table / chair', meaning: 'For sitting / eating', example: 'We have four chairs.' },
      { word: 'bed / wardrobe', meaning: 'Bedroom furniture', example: 'My bed is comfortable.' },
      { word: 'sofa', meaning: 'A long seat for the living room', example: 'We watch TV on the sofa.' },
      { word: 'fridge / cooker', meaning: 'Kitchen appliances', example: 'The fridge is empty.' },
    
      { word: 'shelf / cupboard', meaning: 'Storage furniture', example: 'The plates are in the cupboard.' },
      { word: 'lamp', meaning: 'A light for a room', example: 'Turn on the lamp, please.' },
      { word: 'mirror', meaning: 'For seeing your reflection', example: 'There is a mirror in the hallway.' },
    ],
    pronunciationTip: '"Wardrobe" is stressed on the first part: "WARD-robe", and the "a" sounds like "or".',
    conversation: [
      { speaker: 'A', line: 'Is your flat furnished?' },
      { speaker: 'B', line: 'Yes, it has a bed, a sofa, and a table.' },
    ],
    quiz: [
      { id: 'furniture-1', question: 'What do you sit on to watch TV?', options: ['Sofa', 'Wardrobe', 'Fridge'], correctIndex: 0 },
      { id: 'furniture-2', question: 'Where do you keep clothes?', options: ['Cooker', 'Wardrobe', 'Table'], correctIndex: 1 },
      { id: 'furniture-3', question: 'What keeps food cold?', options: ['Fridge', 'Chair', 'Bed'], correctIndex: 0 },
    ],
  },
  {
    key: 'transport',
    icon: 'truck',
    title: 'Transport',
    vocabulary: [
      { word: 'bus / train / car', meaning: 'Ways to travel', example: 'I go to work by bus.' },
      { word: 'bike / walk', meaning: 'Ways to move without a vehicle', example: 'I walk to the shop.' },
      { word: 'How do you get to...?', meaning: 'Asking how someone travels', example: 'How do you get to work?' },
      { word: 'by car / on foot', meaning: 'Describing how you travel', example: 'I go there on foot.' },
    
      { word: 'motorbike / lorry', meaning: 'More vehicle types', example: 'He drives a lorry for work.' },
      { word: 'traffic', meaning: 'Many vehicles on the road', example: 'There was a lot of traffic today.' },
      { word: 'How long does it take?', meaning: 'Asking about journey time', example: 'How long does it take by car?' },
    ],
    pronunciationTip: 'Use "by" for vehicles ("by bus", "by car") but "on foot" for walking — this is a fixed pattern in English.',
    conversation: [
      { speaker: 'A', line: 'How do you get to work?' },
      { speaker: 'B', line: 'I go by bus. It takes twenty minutes.' },
    ],
    quiz: [
      { id: 'transport-1', question: 'Which is correct?', options: ['I go by foot', 'I go on foot', 'I go in foot'], correctIndex: 1 },
      { id: 'transport-2', question: 'How do you ask about travel?', options: ['How do you get to work?', 'How you go work?', 'Work how get?'], correctIndex: 0 },
      { id: 'transport-3', question: 'Which is a vehicle?', options: ['Walk', 'Bus', 'Foot'], correctIndex: 1 },
    ],
  },
  {
    key: 'public_transport',
    icon: 'navigation-2',
    title: 'Using Public Transport',
    vocabulary: [
      { word: 'bus stop / station', meaning: 'Where you catch transport', example: 'The bus stop is near my house.' },
      { word: 'ticket / fare', meaning: 'What you pay to travel', example: 'How much is the fare?' },
      { word: 'platform', meaning: 'Where a train arrives', example: 'The train is on platform 2.' },
      { word: 'next bus / next train', meaning: 'Asking about timing', example: 'When is the next bus?' },
    
      { word: 'timetable', meaning: 'A schedule of times', example: 'Check the bus timetable.' },
      { word: 'change / transfer', meaning: 'Switching to another bus or train', example: 'You need to change at the next stop.' },
      { word: 'get on / get off', meaning: 'Entering or leaving public transport', example: 'Get off at the next stop.' },
    ],
    pronunciationTip: '"Platform" is stressed on the first part: "PLAT-form", with a short, flat "a" sound.',
    conversation: [
      { speaker: 'You', line: 'Excuse me, when is the next train to London?' },
      { speaker: 'Staff', line: "It's in ten minutes, on platform 3." },
      { speaker: 'You', line: 'Thank you.' },
    ],
    quiz: [
      { id: 'pubtransport-1', question: 'Where do trains arrive?', options: ['Platform', 'Fare', 'Ticket'], correctIndex: 0 },
      { id: 'pubtransport-2', question: 'What do you pay to travel by bus?', options: ['Fare', 'Platform', 'Station'], correctIndex: 0 },
      { id: 'pubtransport-3', question: 'How do you ask about timing?', options: ['When is the next bus?', 'Bus next when?', 'Is bus when next?'], correctIndex: 0 },
    ],
  },
  {
    key: 'asking_for_help',
    icon: 'life-buoy',
    title: 'Asking for Help',
    vocabulary: [
      { word: 'Can you help me?', meaning: 'A polite way to ask for help', example: 'Excuse me, can you help me?' },
      { word: "I don't understand", meaning: 'Saying you are confused', example: "Sorry, I don't understand." },
      { word: 'Can you repeat that?', meaning: 'Asking someone to say it again', example: 'Sorry, can you repeat that?' },
      { word: 'Could you speak slowly?', meaning: 'Asking for slower speech', example: 'Could you speak slowly, please?' },
    
      { word: 'Sorry to bother you', meaning: 'A polite way to interrupt', example: 'Sorry to bother you, can I ask something?' },
      { word: 'I need some assistance', meaning: 'A formal way to ask for help', example: 'I need some assistance, please.' },
      { word: 'Thank you for your help', meaning: 'Thanking someone who helped you', example: 'Thank you for your help today.' },
    ],
    pronunciationTip: 'Say "Excuse me" clearly before asking for help — it politely gets someone\'s attention first.',
    conversation: [
      { speaker: 'You', line: 'Excuse me, can you help me?' },
      { speaker: 'Stranger', line: 'Of course, what do you need?' },
      { speaker: 'You', line: "I don't understand this form. Could you help me?" },
    ],
    quiz: [
      { id: 'help-1', question: 'How do you politely ask for help?', options: ['Help me now', 'Can you help me?', 'Help!'], correctIndex: 1 },
      { id: 'help-2', question: 'What do you say if you are confused?', options: ["I don't understand", 'I am happy', 'Thank you'], correctIndex: 0 },
      { id: 'help-3', question: 'How do you ask someone to say something again?', options: ['Say again now', 'Can you repeat that?', 'What?'], correctIndex: 1 },
    ],
  },
  {
    key: 'bank',
    icon: 'credit-card',
    title: 'At the Bank',
    vocabulary: [
      { word: 'bank account', meaning: 'Where you keep your money', example: "I'd like to open a bank account." },
      { word: 'deposit / withdraw', meaning: 'Put in / take out money', example: 'I want to withdraw some cash.' },
      { word: 'balance', meaning: 'How much money you have', example: 'Can I check my balance?' },
      { word: 'debit card', meaning: 'A card linked to your account', example: 'I paid with my debit card.' },
    
      { word: 'statement', meaning: 'A record of your transactions', example: "I'd like a bank statement, please." },
      { word: 'transfer money', meaning: 'Sending money to another account', example: "I'd like to transfer money to my sister." },
      { word: 'PIN number', meaning: 'A secret code for your card', example: "Don't share your PIN number." },
    ],
    pronunciationTip: '"Withdraw" is stressed on the second part: "with-DRAW".',
    conversation: [
      { speaker: 'You', line: "I'd like to check my balance, please." },
      { speaker: 'Bank staff', line: 'Sure, may I see your card?' },
      { speaker: 'You', line: 'Here you are.' },
    ],
    quiz: [
      { id: 'bank-1', question: 'What do you call taking money out of your account?', options: ['Deposit', 'Withdraw', 'Balance'], correctIndex: 1 },
      { id: 'bank-2', question: 'What shows how much money you have?', options: ['Balance', 'Card', 'Bank'], correctIndex: 0 },
      { id: 'bank-3', question: 'Which is used to pay in shops?', options: ['Debit card', 'Balance', 'Deposit'], correctIndex: 0 },
    ],
  },
  {
    key: 'post_office',
    icon: 'mail',
    title: 'At the Post Office',
    vocabulary: [
      { word: 'post a letter / parcel', meaning: 'Sending mail', example: "I'd like to post this parcel." },
      { word: 'stamp', meaning: 'Paid label for a letter', example: 'I need a stamp, please.' },
      { word: 'address', meaning: 'Where mail is sent', example: "What's the address?" },
      { word: 'How much to send this to...?', meaning: 'Asking the cost of postage', example: 'How much to send this to France?' },
    
      { word: 'signed for', meaning: 'A delivery requiring a signature', example: "I'd like to send this signed for." },
      { word: 'postbox', meaning: 'Where you put outgoing letters', example: 'The postbox is on the corner.' },
      { word: 'tracking number', meaning: 'A code to follow a parcel', example: "What's the tracking number?" },
    ],
    pronunciationTip: '"Parcel" is stressed on the first part: "PAR-sel".',
    conversation: [
      { speaker: 'You', line: "I'd like to post this parcel, please." },
      { speaker: 'Staff', line: 'Where is it going?' },
      { speaker: 'You', line: 'To Pakistan. How much will it cost?' },
    ],
    quiz: [
      { id: 'post-1', question: 'What do you put on a letter to send it?', options: ['Stamp', 'Address', 'Card'], correctIndex: 0 },
      { id: 'post-2', question: 'How do you ask the cost of sending something?', options: ['How much to send this?', 'This cost how?', 'Send how much?'], correctIndex: 0 },
      { id: 'post-3', question: 'What word means "where mail is sent"?', options: ['Address', 'Stamp', 'Parcel'], correctIndex: 0 },
    ],
  },
  {
    key: 'pharmacy',
    icon: 'plus-circle',
    title: 'At the Pharmacy',
    vocabulary: [
      { word: 'pharmacy / chemist', meaning: 'A shop that sells medicine', example: "I'm going to the pharmacy." },
      { word: 'prescription', meaning: 'A doctor\'s note for medicine', example: 'I have a prescription.' },
      { word: 'painkillers', meaning: 'Medicine for pain', example: 'Do you have any painkillers?' },
      { word: 'Do you have something for...?', meaning: 'Asking for medicine', example: 'Do you have something for a cough?' },
    
      { word: 'allergic to', meaning: 'Having a bad reaction to something', example: "I'm allergic to penicillin." },
      { word: 'over the counter', meaning: 'Medicine you can buy without a prescription', example: 'This is available over the counter.' },
      { word: 'take twice a day', meaning: 'Medicine dosage instructions', example: 'Take this twice a day.' },
    ],
    pronunciationTip: '"Pharmacy" starts with an "f" sound — say "FAR-muh-see", not "PAR-muh-see".',
    conversation: [
      { speaker: 'You', line: 'Do you have something for a headache?' },
      { speaker: 'Pharmacist', line: 'Yes, these painkillers should help.' },
      { speaker: 'You', line: 'Thank you.' },
    ],
    quiz: [
      { id: 'pharmacy-1', question: 'Where do you buy medicine?', options: ['Pharmacy', 'Bank', 'Library'], correctIndex: 0 },
      { id: 'pharmacy-2', question: 'What is medicine for pain called?', options: ['Prescription', 'Painkillers', 'Stamp'], correctIndex: 1 },
      { id: 'pharmacy-3', question: 'What does a doctor give you to get medicine?', options: ['A prescription', 'A receipt', 'A ticket'], correctIndex: 0 },
    ],
  },
  {
    key: 'phone_calls',
    icon: 'phone',
    title: 'Making a Phone Call',
    vocabulary: [
      { word: 'Hello, this is...', meaning: 'How to start a phone call', example: 'Hello, this is Amina.' },
      { word: 'Can I speak to...?', meaning: 'Asking for someone on the phone', example: 'Can I speak to Mr Ahmed?' },
      { word: "I'll call you back", meaning: 'Saying you will phone again', example: "I'll call you back later." },
      { word: 'hold on / one moment', meaning: 'Asking someone to wait', example: 'One moment, please.' },
    
      { word: 'wrong number', meaning: 'Calling a number by mistake', example: 'Sorry, wrong number.' },
      { word: "It's engaged", meaning: 'The phone line is busy', example: 'The line is engaged, try later.' },
      { word: 'text message', meaning: 'A written message on a phone', example: "I'll send you a text message." },
    ],
    pronunciationTip: 'On the phone, speak a little slower and clearer than usual — the listener cannot see your face.',
    conversation: [
      { speaker: 'You', line: 'Hello, this is Amina. Can I speak to the doctor, please?' },
      { speaker: 'Receptionist', line: 'One moment, please.' },
      { speaker: 'You', line: 'Thank you.' },
    ],
    quiz: [
      { id: 'phone-1', question: 'How do you start a phone call?', options: ['Hello, this is...', 'Goodbye', 'Yes please'], correctIndex: 0 },
      { id: 'phone-2', question: 'How do you ask for someone on the phone?', options: ['Can I speak to...?', 'Who is this?', 'Speak now'], correctIndex: 0 },
      { id: 'phone-3', question: 'What do you say to ask someone to wait?', options: ['One moment, please', 'Go now', 'No thanks'], correctIndex: 0 },
    ],
  },
  {
    key: 'booking_appointments',
    icon: 'check-square',
    title: 'Booking Appointments',
    vocabulary: [
      { word: "I'd like to book an appointment", meaning: 'Requesting an appointment', example: "I'd like to book an appointment with the dentist." },
      { word: 'Is ... available?', meaning: 'Asking if a time works', example: 'Is Monday morning available?' },
      { word: 'reschedule / cancel', meaning: 'Change or remove an appointment', example: "I need to reschedule my appointment." },
      { word: 'confirm', meaning: 'To make something certain', example: 'Can you confirm the time?' },
    
      { word: 'earliest appointment', meaning: 'The soonest available time', example: "What's the earliest appointment?" },
      { word: 'double-check', meaning: 'To check again to be sure', example: 'Let me double-check the time.' },
      { word: 'appointment card', meaning: 'A card with your appointment details', example: 'Please keep your appointment card.' },
    ],
    pronunciationTip: '"Appointment" is stressed on the second part: "a-POINT-ment".',
    conversation: [
      { speaker: 'You', line: "I'd like to book an appointment, please." },
      { speaker: 'Receptionist', line: 'Is Tuesday at 10am available for you?' },
      { speaker: 'You', line: 'Yes, that works. Thank you.' },
    ],
    quiz: [
      { id: 'appt-1', question: 'How do you request an appointment?', options: ["I'd like to book an appointment", 'Give me appointment', 'Appointment now'], correctIndex: 0 },
      { id: 'appt-2', question: 'What do you say to change an appointment time?', options: ['Reschedule', 'Confirm', 'Cancel bank'], correctIndex: 0 },
      { id: 'appt-3', question: 'What does "confirm" mean?', options: ['Make something certain', 'Cancel it', 'Forget it'], correctIndex: 0 },
    ],
  },
  {
    key: 'school_education',
    icon: 'book-open',
    title: 'School and Education',
    vocabulary: [
      { word: 'school / college / university', meaning: 'Places of learning', example: 'My son goes to school.' },
      { word: 'teacher / student', meaning: 'People at school', example: 'The teacher is kind.' },
      { word: 'subject', meaning: 'A topic studied at school', example: 'Maths is my favourite subject.' },
      { word: 'term / holiday', meaning: 'School time periods', example: 'The school term starts in September.' },
    
      { word: 'classroom', meaning: 'A room where lessons happen', example: 'The classroom is upstairs.' },
      { word: 'exam / test', meaning: 'An assessment of learning', example: 'I have an exam next week.' },
      { word: 'timetable', meaning: 'A schedule of lessons', example: "What's on your timetable today?" },
    ],
    pronunciationTip: '"School" has a long "oo" sound — say "skoo-l", keeping the vowel long.',
    conversation: [
      { speaker: 'A', line: 'Which school does your daughter go to?' },
      { speaker: 'B', line: 'She goes to the primary school near our house.' },
    ],
    quiz: [
      { id: 'school-1', question: 'Who teaches at a school?', options: ['Student', 'Teacher', 'Doctor'], correctIndex: 1 },
      { id: 'school-2', question: 'What is a topic studied at school called?', options: ['Term', 'Subject', 'Holiday'], correctIndex: 1 },
      { id: 'school-3', question: 'Which is a place of learning?', options: ['University', 'Pharmacy', 'Bank'], correctIndex: 0 },
    ],
  },
  {
    key: 'hobbies',
    icon: 'music',
    title: 'Hobbies',
    vocabulary: [
      { word: 'reading / cooking', meaning: 'Common hobbies', example: 'My hobby is reading.' },
      { word: 'playing football', meaning: 'A sport hobby', example: 'I enjoy playing football.' },
      { word: 'gardening / painting', meaning: 'Creative hobbies', example: 'She loves gardening.' },
      { word: 'What do you do in your free time?', meaning: 'Asking about hobbies', example: 'What do you do in your free time?' },
    
      { word: 'drawing / photography', meaning: 'Creative hobbies', example: 'My hobby is photography.' },
      { word: 'collecting', meaning: 'Gathering items as a hobby', example: 'He enjoys collecting stamps.' },
      { word: "I'm interested in...", meaning: 'Describing an interest', example: "I'm interested in music." },
    ],
    pronunciationTip: '"Hobby" is stressed on the first part: "HOB-ee".',
    conversation: [
      { speaker: 'Examiner', line: 'What do you do in your free time?' },
      { speaker: 'You', line: 'I enjoy cooking and reading books.' },
    ],
    quiz: [
      { id: 'hobbies-1', question: 'How do you ask about someone\'s hobbies?', options: ['What do you do in your free time?', 'Do you free time?', 'Hobby what?'], correctIndex: 0 },
      { id: 'hobbies-2', question: 'Which is a hobby?', options: ['Reading', 'Working', 'Sleeping'], correctIndex: 0 },
      { id: 'hobbies-3', question: 'Which sentence is correct?', options: ['My hobby is reading', 'My hobby reading is', 'Reading my hobby is'], correctIndex: 0 },
    ],
  },
  {
    key: 'sports',
    icon: 'target',
    title: 'Sports',
    vocabulary: [
      { word: 'football / swimming', meaning: 'Common sports', example: 'I like swimming.' },
      { word: 'play / go swimming', meaning: 'Sport verbs', example: 'We play football on Sundays.' },
      { word: 'gym', meaning: 'A place to exercise', example: 'I go to the gym twice a week.' },
      { word: 'team', meaning: 'A group who plays together', example: 'I play in a local team.' },
    
      { word: 'running / cycling', meaning: 'Individual sports', example: 'I go running every morning.' },
      { word: 'match / competition', meaning: 'A sports event', example: 'We watched the match on TV.' },
      { word: 'win / lose', meaning: 'Outcomes of a game', example: 'Our team won the match.' },
    ],
    pronunciationTip: 'Use "play" for team sports ("play football") but "go" for activities ending in "-ing" ("go swimming").',
    conversation: [
      { speaker: 'A', line: 'Do you like sports?' },
      { speaker: 'B', line: 'Yes, I play football every weekend.' },
    ],
    quiz: [
      { id: 'sports-1', question: 'Which is correct?', options: ['Play swimming', 'Go swimming', 'Do swimming football'], correctIndex: 1 },
      { id: 'sports-2', question: 'Where do people exercise indoors?', options: ['Gym', 'Kitchen', 'Bank'], correctIndex: 0 },
      { id: 'sports-3', question: 'What is a group who plays together called?', options: ['Team', 'Family', 'Class'], correctIndex: 0 },
    ],
  },
  {
    key: 'free_time',
    icon: 'play-circle',
    title: 'Free Time',
    vocabulary: [
      { word: 'relax', meaning: 'To rest and feel calm', example: 'I relax by watching TV.' },
      { word: 'watch TV / listen to music', meaning: 'Common free time activities', example: 'I like to listen to music.' },
      { word: 'spend time with family', meaning: 'Being with loved ones', example: 'I spend time with my family at weekends.' },
      { word: 'on my day off', meaning: 'When you are not working', example: 'On my day off, I relax at home.' },
    
      { word: 'day trip', meaning: 'A short outing for one day', example: 'We went on a day trip to the coast.' },
      { word: 'stay at home', meaning: 'Not going out', example: 'I stayed at home this weekend.' },
      { word: 'spare time', meaning: 'Time not used for work', example: 'I read in my spare time.' },
    ],
    pronunciationTip: '"Relax" is stressed on the second part: "re-LAX".',
    conversation: [
      { speaker: 'A', line: 'What do you do on your day off?' },
      { speaker: 'B', line: 'I usually relax and spend time with my family.' },
    ],
    quiz: [
      { id: 'freetime-1', question: 'What does "relax" mean?', options: ['To rest and feel calm', 'To work hard', 'To run fast'], correctIndex: 0 },
      { id: 'freetime-2', question: 'When are you "not working"?', options: ['On my day off', 'At work', 'In a meeting'], correctIndex: 0 },
      { id: 'freetime-3', question: 'Which is a free time activity?', options: ['Listening to music', 'Working overtime', 'Filling in forms'], correctIndex: 0 },
    ],
  },
  {
    key: 'describing_people',
    icon: 'user',
    title: 'Describing People',
    vocabulary: [
      { word: 'tall / short', meaning: 'Height', example: 'My brother is tall.' },
      { word: 'young / old', meaning: 'Age', example: 'She is young.' },
      { word: 'friendly / kind', meaning: 'Personality', example: 'My neighbour is very friendly.' },
      { word: 'He/She has... hair/eyes', meaning: 'Describing appearance', example: 'She has brown hair.' },
    
      { word: 'slim / heavy build', meaning: 'Body build descriptions', example: 'He has a slim build.' },
      { word: 'polite / rude', meaning: 'Manners descriptions', example: 'She is always polite.' },
      { word: 'What does he/she look like?', meaning: 'Asking for a description', example: 'What does your father look like?' },
    ],
    pronunciationTip: '"Friendly" ends softly — say "FREND-lee", not "friend-LEE".',
    conversation: [
      { speaker: 'A', line: 'What does your sister look like?' },
      { speaker: 'B', line: "She's tall and has short black hair." },
    ],
    quiz: [
      { id: 'describe-1', question: 'Which word describes personality?', options: ['Tall', 'Friendly', 'Young'], correctIndex: 1 },
      { id: 'describe-2', question: 'How do you describe hair colour?', options: ['She has brown hair', 'She hair brown', 'Brown she has hair'], correctIndex: 0 },
      { id: 'describe-3', question: 'Which word describes height?', options: ['Kind', 'Short', 'Old'], correctIndex: 1 },
    ],
  },
  {
    key: 'feelings_emotions',
    icon: 'meh',
    title: 'Feelings and Emotions',
    vocabulary: [
      { word: 'happy / sad', meaning: 'Basic feelings', example: "I'm happy today." },
      { word: 'tired / excited', meaning: 'More feelings', example: "I'm excited about the trip." },
      { word: 'worried / nervous', meaning: 'Feelings of concern', example: "I'm a bit nervous about the exam." },
      { word: 'How do you feel?', meaning: 'Asking about feelings', example: 'How do you feel today?' },
    
      { word: 'angry / calm', meaning: 'More feelings', example: 'He looked angry.' },
      { word: 'surprised', meaning: 'Feeling unexpected shock', example: 'I was surprised by the news.' },
      { word: "I'm fine", meaning: 'A common reply about wellbeing', example: "I'm fine, thanks." },
    ],
    pronunciationTip: '"Tired" is one syllable — "tyerd", not "TY-er-red".',
    conversation: [
      { speaker: 'A', line: 'How do you feel about the interview?' },
      { speaker: 'B', line: "I'm a bit nervous, but excited too." },
    ],
    quiz: [
      { id: 'feelings-1', question: 'How do you ask about feelings?', options: ['How do you feel?', 'What you feel?', 'Feel how?'], correctIndex: 0 },
      { id: 'feelings-2', question: 'Which word means "a little afraid"?', options: ['Excited', 'Nervous', 'Happy'], correctIndex: 1 },
      { id: 'feelings-3', question: 'What is the opposite of "happy"?', options: ['Sad', 'Tired', 'Excited'], correctIndex: 0 },
    ],
  },
  {
    key: 'likes_dislikes',
    icon: 'thumbs-up',
    title: 'Likes and Dislikes',
    vocabulary: [
      { word: 'I like / I love', meaning: 'Positive preference', example: 'I love cooking.' },
      { word: "I don't like / I hate", meaning: 'Negative preference', example: "I don't like spicy food." },
      { word: 'I prefer... to...', meaning: 'Comparing preferences', example: 'I prefer tea to coffee.' },
      { word: 'What do you like doing?', meaning: 'Asking about preferences', example: 'What do you like doing at weekends?' },
    
      { word: "I'm not keen on...", meaning: 'A soft way to say you dislike something', example: "I'm not keen on spicy food." },
      { word: 'favourite', meaning: 'The one you like the most', example: "What's your favourite film?" },
      { word: "It's not for me", meaning: 'Politely saying something is not to your taste', example: "Sushi's not for me." },
    ],
    pronunciationTip: 'After "like" or "love", use a verb ending in "-ing": "I like cooking", not "I like cook".',
    conversation: [
      { speaker: 'A', line: 'Do you like tea or coffee?' },
      { speaker: 'B', line: 'I prefer tea to coffee.' },
    ],
    quiz: [
      { id: 'likes-1', question: 'Which sentence is correct?', options: ['I like cook', 'I like cooking', 'I liking cook'], correctIndex: 1 },
      { id: 'likes-2', question: 'How do you compare two things you like?', options: ['I prefer tea to coffee', 'I prefer tea coffee', 'Tea I prefer'], correctIndex: 0 },
      { id: 'likes-3', question: 'What is the opposite of "I love it"?', options: ['I like it', 'I hate it', 'I prefer it'], correctIndex: 1 },
    ],
  },
  {
    key: 'making_plans',
    icon: 'list',
    title: 'Making Plans',
    vocabulary: [
      { word: 'Shall we...?', meaning: 'Suggesting an activity', example: 'Shall we meet on Friday?' },
      { word: "Let's...", meaning: 'Suggesting doing something together', example: "Let's go to the park." },
      { word: 'What time suits you?', meaning: 'Asking about a good time', example: 'What time suits you tomorrow?' },
      { word: "That works for me", meaning: 'Agreeing to a plan', example: 'Friday at 6pm? That works for me.' },
    
      { word: 'arrange to meet', meaning: 'To plan a meeting', example: "Let's arrange to meet next week." },
      { word: 'free / busy', meaning: 'Whether you are available', example: 'Are you free on Friday?' },
      { word: 'confirm the plan', meaning: 'Making a plan definite', example: "I'll confirm the plan tomorrow." },
    ],
    pronunciationTip: '"Shall we" is often said quickly together: "shall-we", almost like one word, in casual speech.',
    conversation: [
      { speaker: 'A', line: 'Shall we meet for coffee this week?' },
      { speaker: 'B', line: 'Sure, what time suits you?' },
      { speaker: 'A', line: 'How about Thursday at 5pm?' },
      { speaker: 'B', line: 'That works for me.' },
    ],
    quiz: [
      { id: 'plans-1', question: 'How do you suggest an activity?', options: ['Shall we...?', 'Do we...?', 'Will we...?'], correctIndex: 0 },
      { id: 'plans-2', question: 'How do you agree to a plan?', options: ['That works for me', 'No thanks', 'I do not know'], correctIndex: 0 },
      { id: 'plans-3', question: 'How do you ask about a good time?', options: ['What time suits you?', 'When you time?', 'Time what suits?'], correctIndex: 0 },
    ],
  },
  {
    key: 'invitations',
    icon: 'send',
    title: 'Invitations',
    vocabulary: [
      { word: "Would you like to...?", meaning: 'A polite invitation', example: 'Would you like to come for dinner?' },
      { word: "I'd love to", meaning: 'Accepting happily', example: "I'd love to, thank you." },
      { word: "I'm afraid I can't", meaning: 'Politely declining', example: "I'm afraid I can't, I'm busy." },
      { word: 'Thanks for inviting me', meaning: 'Thanking for an invitation', example: 'Thanks for inviting me to the party.' },
    
      { word: 'a party', meaning: 'A social celebration', example: "We're having a party on Saturday." },
      { word: 'RSVP', meaning: 'Please respond to an invitation', example: 'Please RSVP by Friday.' },
      { word: 'bring a friend', meaning: 'An invitation to bring someone else', example: 'Feel free to bring a friend.' },
    ],
    pronunciationTip: '"Would you" is often blended in speech to sound like "WOOD-jew".',
    conversation: [
      { speaker: 'A', line: 'Would you like to come to my birthday party?' },
      { speaker: 'B', line: "I'd love to! Thanks for inviting me." },
    ],
    quiz: [
      { id: 'invite-1', question: 'How do you politely invite someone?', options: ['Would you like to...?', 'Come now', 'You must come'], correctIndex: 0 },
      { id: 'invite-2', question: 'How do you politely decline?', options: ["I'd love to", "I'm afraid I can't", 'Never'], correctIndex: 1 },
      { id: 'invite-3', question: 'How do you thank someone for an invitation?', options: ['Thanks for inviting me', 'No thanks', 'See you'], correctIndex: 0 },
    ],
  },
  {
    key: 'restaurant_ordering',
    icon: 'coffee',
    title: 'Ordering in a Restaurant',
    vocabulary: [
      { word: 'menu', meaning: 'The list of food and drink', example: 'Can I see the menu, please?' },
      { word: "I'd like to order...", meaning: 'How to order food', example: "I'd like to order the chicken, please." },
      { word: 'the bill', meaning: 'What you pay at the end', example: 'Can we have the bill, please?' },
      { word: 'table for two', meaning: 'Asking for seating', example: "A table for two, please." },
    
      { word: 'starter / main course / dessert', meaning: 'Parts of a meal', example: "I'll have the soup as a starter." },
      { word: 'Could we have some water?', meaning: 'Requesting something at a restaurant', example: 'Could we have some water, please?' },
      { word: 'That was delicious', meaning: 'Complimenting the food', example: 'Thank you, that was delicious.' },
    ],
    pronunciationTip: '"Bill" and "meal" have a clear, short vowel — don\'t stretch the "i" in "bill".',
    conversation: [
      { speaker: 'Waiter', line: 'Good evening, table for how many?' },
      { speaker: 'You', line: 'A table for two, please.' },
      { speaker: 'Waiter', line: 'Are you ready to order?' },
      { speaker: 'You', line: "Yes, I'd like the soup, please." },
    ],
    quiz: [
      { id: 'restaurant-1', question: 'What do you ask to see food choices?', options: ['The bill', 'The menu', 'The table'], correctIndex: 1 },
      { id: 'restaurant-2', question: 'What do you ask for at the end of the meal?', options: ['The bill', 'The menu', 'A table'], correctIndex: 0 },
      { id: 'restaurant-3', question: 'How do you order food politely?', options: ["I'd like to order...", 'Give me food', 'Food now'], correctIndex: 0 },
    ],
  },
  {
    key: 'supermarket',
    icon: 'shopping-cart',
    title: 'At the Supermarket',
    vocabulary: [
      { word: 'trolley / basket', meaning: 'For carrying shopping', example: 'I need a trolley.' },
      { word: 'aisle', meaning: 'A row in the supermarket', example: 'The bread is in aisle three.' },
      { word: 'checkout', meaning: 'Where you pay', example: 'The checkout is very busy.' },
      { word: "Where can I find...?", meaning: 'Asking for an item', example: 'Where can I find the milk?' },
    
      { word: 'fresh / frozen', meaning: 'Food storage types', example: 'I prefer fresh vegetables.' },
      { word: 'special offer', meaning: 'A discounted deal', example: "There's a special offer on bread." },
      { word: 'self-checkout', meaning: 'A machine where you scan your own items', example: 'I used the self-checkout.' },
    ],
    pronunciationTip: '"Aisle" sounds exactly like "I will" — the "s" is silent.',
    conversation: [
      { speaker: 'You', line: 'Excuse me, where can I find the rice?' },
      { speaker: 'Staff', line: "It's in aisle five, next to the pasta." },
      { speaker: 'You', line: 'Thank you.' },
    ],
    quiz: [
      { id: 'supermarket-1', question: 'Where do you pay for shopping?', options: ['Checkout', 'Aisle', 'Trolley'], correctIndex: 0 },
      { id: 'supermarket-2', question: 'What word means a row of shelves?', options: ['Aisle', 'Basket', 'Checkout'], correctIndex: 0 },
      { id: 'supermarket-3', question: 'How do you ask where an item is?', options: ['Where can I find...?', 'What is this?', 'How much?'], correctIndex: 0 },
    ],
  },
  {
    key: 'cooking_kitchen',
    icon: 'coffee',
    title: 'Cooking and the Kitchen',
    vocabulary: [
      { word: 'cook / boil / fry', meaning: 'Cooking methods', example: 'I fry the onions first.' },
      { word: 'pot / pan', meaning: 'Cooking containers', example: 'The pan is hot.' },
      { word: 'recipe', meaning: 'Instructions for cooking a dish', example: 'I have a good recipe for curry.' },
      { word: 'ingredients', meaning: 'What you need for a dish', example: 'I need to buy the ingredients.' },
    
      { word: 'chop / slice', meaning: 'Ways to cut food', example: 'Chop the onions finely.' },
      { word: 'oven / microwave', meaning: 'Kitchen appliances for heating food', example: "I'll heat it in the microwave." },
      { word: 'taste good', meaning: 'Describing good flavour', example: 'This tastes really good.' },
    ],
    pronunciationTip: '"Recipe" is stressed on the first part and the second "e" is silent-ish: "RES-uh-pee".',
    conversation: [
      { speaker: 'A', line: 'What are you cooking tonight?' },
      { speaker: 'B', line: "I'm following a new recipe for chicken curry." },
    ],
    quiz: [
      { id: 'cooking-1', question: 'What gives instructions for a dish?', options: ['Recipe', 'Pan', 'Aisle'], correctIndex: 0 },
      { id: 'cooking-2', question: 'What do you call the things you need to cook a dish?', options: ['Ingredients', 'Bill', 'Menu'], correctIndex: 0 },
      { id: 'cooking-3', question: 'Which is a cooking method?', options: ['Boil', 'Wardrobe', 'Aisle'], correctIndex: 0 },
    ],
  },
  {
    key: 'weekend_activities',
    icon: 'sun',
    title: 'Weekend Activities',
    vocabulary: [
      { word: 'go out / stay in', meaning: 'Going somewhere or staying home', example: 'We usually stay in on Sundays.' },
      { word: 'meet friends', meaning: 'Socialising', example: 'I meet friends on Saturdays.' },
      { word: 'go for a walk', meaning: 'Walking outside', example: 'We go for a walk in the park.' },
      { word: "What did you do at the weekend?", meaning: 'Asking about the past weekend', example: 'What did you do at the weekend?' },
    
      { word: 'visit family', meaning: 'Spending time with relatives', example: 'I visit my family at weekends.' },
      { word: 'do some shopping', meaning: 'Going shopping as an activity', example: "I'll do some shopping on Saturday." },
      { word: 'have a lie-in', meaning: 'To sleep late', example: 'I love having a lie-in on Sundays.' },
    ],
    pronunciationTip: '"Weekend" can be stressed either way in British English, but "WEEK-end" is most common.',
    conversation: [
      { speaker: 'A', line: 'What did you do at the weekend?' },
      { speaker: 'B', line: 'I met friends and went for a walk in the park.' },
    ],
    quiz: [
      { id: 'weekend-1', question: 'How do you ask about a past weekend?', options: ['What did you do at the weekend?', 'What do weekend?', 'Weekend what?'], correctIndex: 0 },
      { id: 'weekend-2', question: 'Which means "socialise with friends"?', options: ['Meet friends', 'Stay in', 'Go for a walk'], correctIndex: 0 },
      { id: 'weekend-3', question: 'What is the opposite of "go out"?', options: ['Stay in', 'Go for a walk', 'Meet friends'], correctIndex: 0 },
    ],
  },
  {
    key: 'seasons',
    icon: 'cloud-drizzle',
    title: 'Seasons',
    vocabulary: [
      { word: 'spring / summer', meaning: 'Warmer seasons', example: 'I like summer best.' },
      { word: 'autumn / winter', meaning: 'Cooler seasons', example: 'It gets cold in winter.' },
      { word: 'My favourite season is...', meaning: 'Saying which season you like', example: 'My favourite season is spring.' },
      { word: 'leaves fall / it snows', meaning: 'What happens in each season', example: 'The leaves fall in autumn.' },
    
      { word: 'season', meaning: 'One of the four parts of the year', example: 'Which season do you like best?' },
      { word: 'blossom / bloom', meaning: 'Flowers appearing in spring', example: 'The flowers bloom in spring.' },
      { word: 'It gets dark early', meaning: 'Describing shorter winter days', example: 'It gets dark early in winter.' },
    ],
    pronunciationTip: '"Autumn" has a silent "n" ending sound is soft — say "AW-tum", not "AW-tumn" with a hard n.',
    conversation: [
      { speaker: 'A', line: "What's your favourite season?" },
      { speaker: 'B', line: 'I like autumn because the weather is mild.' },
    ],
    quiz: [
      { id: 'seasons-1', question: 'Which season is coldest in the UK?', options: ['Summer', 'Winter', 'Spring'], correctIndex: 1 },
      { id: 'seasons-2', question: 'What happens in winter in the UK?', options: ['It snows', 'Leaves grow', 'It is hottest'], correctIndex: 0 },
      { id: 'seasons-3', question: 'How do you say your favourite season?', options: ['My favourite season is...', 'Season favourite my', 'I season like'], correctIndex: 0 },
    ],
  },
  {
    key: 'animals',
    icon: 'feather',
    title: 'Animals',
    vocabulary: [
      { word: 'dog / cat', meaning: 'Common pets', example: 'I have a dog.' },
      { word: 'bird / fish', meaning: 'Other common pets', example: 'My daughter has a fish.' },
      { word: 'Do you have any pets?', meaning: 'Asking about pets', example: 'Do you have any pets?' },
      { word: 'farm animals', meaning: 'Animals kept on farms', example: 'Cows and sheep are farm animals.' },
    
      { word: 'rabbit / hamster', meaning: 'Small pets', example: 'My daughter has a hamster.' },
      { word: 'wild animals', meaning: 'Animals not kept as pets', example: 'We saw wild animals at the safari park.' },
      { word: 'feed the animal', meaning: 'Giving an animal food', example: 'Please do not feed the animals.' },
    ],
    pronunciationTip: '"Animal" is stressed on the first part: "AN-i-mal".',
    conversation: [
      { speaker: 'A', line: 'Do you have any pets?' },
      { speaker: 'B', line: 'Yes, I have a dog and a cat.' },
    ],
    quiz: [
      { id: 'animals-1', question: 'Which is a common pet?', options: ['Dog', 'Cow', 'Sheep'], correctIndex: 0 },
      { id: 'animals-2', question: 'How do you ask about pets?', options: ['Do you have any pets?', 'Pets you have?', 'Have pets you?'], correctIndex: 0 },
      { id: 'animals-3', question: 'Which are farm animals?', options: ['Cows and sheep', 'Dogs and cats', 'Birds and fish'], correctIndex: 0 },
    ],
  },
  {
    key: 'clothes_sizes',
    icon: 'tag',
    title: 'Clothes Sizes',
    vocabulary: [
      { word: 'small / medium / large', meaning: 'Common sizes', example: "I'm a medium." },
      { word: 'What size are you?', meaning: 'Asking about size', example: 'What size are you?' },
      { word: 'Can I try this on?', meaning: 'Asking to try clothes', example: 'Can I try this on, please?' },
      { word: 'fitting room', meaning: 'Where you try on clothes', example: 'The fitting room is over there.' },
    
      { word: 'tight / loose', meaning: 'How clothes fit', example: 'These trousers are too tight.' },
      { word: 'a bigger / smaller size', meaning: 'Requesting a different size', example: 'Do you have a bigger size?' },
      { word: 'exchange', meaning: 'To swap for a different item', example: "I'd like to exchange this, please." },
    ],
    pronunciationTip: '"Medium" has three syllables: "MEE-dee-um" — don\'t rush it into two.',
    conversation: [
      { speaker: 'You', line: 'Can I try this on, please?' },
      { speaker: 'Shop assistant', line: 'Of course, the fitting room is over there. What size are you?' },
      { speaker: 'You', line: "I'm a medium." },
    ],
    quiz: [
      { id: 'sizes-1', question: 'Where do you try on clothes?', options: ['Fitting room', 'Checkout', 'Kitchen'], correctIndex: 0 },
      { id: 'sizes-2', question: 'How do you ask to try something on?', options: ['Can I try this on?', 'Give me this', 'This is mine'], correctIndex: 0 },
      { id: 'sizes-3', question: 'Which is a clothing size?', options: ['Medium', 'Aisle', 'Balance'], correctIndex: 0 },
    ],
  },
  {
    key: 'money_prices',
    icon: 'dollar-sign',
    title: 'Money and Prices',
    vocabulary: [
      { word: 'pound / pence', meaning: 'UK currency', example: "It's five pounds." },
      { word: 'expensive / cheap', meaning: 'Describing prices', example: "That's quite expensive." },
      { word: 'discount / sale', meaning: 'Reduced prices', example: 'There is a sale this week.' },
      { word: 'How much does it cost?', meaning: 'Asking the price', example: 'How much does it cost?' },
    
      { word: 'free of charge', meaning: 'Costing nothing', example: 'Delivery is free of charge.' },
      { word: 'change (money)', meaning: 'Coins given back after paying', example: "Here's your change." },
      { word: 'afford', meaning: 'To have enough money for something', example: "I can't afford that right now." },
    ],
    pronunciationTip: '"Pence" rhymes with "tens" — say "pens", not "peens".',
    conversation: [
      { speaker: 'You', line: 'How much does this cost?' },
      { speaker: 'Shop assistant', line: "It's ten pounds fifty. There's a discount today." },
    ],
    quiz: [
      { id: 'money-1', question: 'What is the UK currency called?', options: ['Pound', 'Dollar', 'Euro'], correctIndex: 0 },
      { id: 'money-2', question: 'What word means "reduced price"?', options: ['Discount', 'Expensive', 'Balance'], correctIndex: 0 },
      { id: 'money-3', question: 'How do you ask the price?', options: ['How much does it cost?', 'What is it?', 'Where is it?'], correctIndex: 0 },
    ],
  },
  {
    key: 'paying_bills',
    icon: 'file-text',
    title: 'Paying Bills',
    vocabulary: [
      { word: 'bill', meaning: 'A request for payment', example: 'I need to pay the electricity bill.' },
      { word: 'due date', meaning: 'When payment is needed by', example: 'The due date is the 5th.' },
      { word: 'pay online / by direct debit', meaning: 'Ways to pay bills', example: 'I pay my bills by direct debit.' },
      { word: 'overdue', meaning: 'Payment is late', example: 'My bill is overdue.' },
    
      { word: 'monthly payment', meaning: 'Money paid every month', example: 'My monthly payment is £40.' },
      { word: 'gas / electricity / water bill', meaning: 'Common household bills', example: 'The electricity bill arrived today.' },
      { word: 'payment plan', meaning: 'An agreed way to pay over time', example: 'I set up a payment plan.' },
    ],
    pronunciationTip: '"Overdue" is stressed on the last part: "over-DUE".',
    conversation: [
      { speaker: 'A', line: 'Have you paid the gas bill this month?' },
      { speaker: 'B', line: 'Yes, I pay it by direct debit every month.' },
    ],
    quiz: [
      { id: 'bills-1', question: 'What is a request for payment called?', options: ['Bill', 'Discount', 'Balance'], correctIndex: 0 },
      { id: 'bills-2', question: 'What does "overdue" mean?', options: ['Payment is late', 'Payment is early', 'Payment is free'], correctIndex: 0 },
      { id: 'bills-3', question: 'Which is an automatic way to pay bills?', options: ['Direct debit', 'Cash only', 'Free'], correctIndex: 0 },
    ],
  },
  {
    key: 'renting_a_house',
    icon: 'key',
    title: 'Renting a House',
    vocabulary: [
      { word: 'rent / landlord', meaning: 'Payment and property owner', example: 'I pay rent every month.' },
      { word: 'tenant', meaning: 'A person who rents a home', example: 'I am the tenant of this flat.' },
      { word: 'deposit', meaning: 'Money paid before moving in', example: 'I paid a deposit for the flat.' },
      { word: 'contract / agreement', meaning: 'A signed rental document', example: 'Please sign the contract.' },
    
      { word: 'furnished / unfurnished', meaning: 'Whether a property has furniture', example: "It's a furnished flat." },
      { word: 'move in / move out', meaning: 'Starting or ending a tenancy', example: 'We move in next month.' },
      { word: 'notice period', meaning: 'Time you must give before leaving', example: 'The notice period is one month.' },
    ],
    pronunciationTip: '"Tenant" is stressed on the first part: "TEN-ant".',
    conversation: [
      { speaker: 'You', line: "I'd like to rent this flat. How much is the deposit?" },
      { speaker: 'Landlord', line: "It's one month's rent as a deposit." },
    ],
    quiz: [
      { id: 'renting-1', question: 'What do you call the owner of a rented property?', options: ['Landlord', 'Tenant', 'Neighbour'], correctIndex: 0 },
      { id: 'renting-2', question: 'What do you call a person who rents a home?', options: ['Tenant', 'Landlord', 'Guest'], correctIndex: 0 },
      { id: 'renting-3', question: 'What is money paid before moving in called?', options: ['Deposit', 'Bill', 'Fare'], correctIndex: 0 },
    ],
  },
  {
    key: 'neighbours',
    icon: 'users',
    title: 'Neighbours',
    vocabulary: [
      { word: 'neighbour', meaning: 'Someone who lives near you', example: 'My neighbour is very friendly.' },
      { word: 'next door', meaning: 'The house beside yours', example: 'They live next door.' },
      { word: 'noisy / quiet', meaning: 'Describing noise levels', example: 'Our street is quiet.' },
      { word: "Nice to meet you, I'm your neighbour", meaning: 'Introducing yourself to a neighbour', example: "Hi, I'm your new neighbour." },
    
      { word: 'get on well with', meaning: 'To have a good relationship', example: 'I get on well with my neighbours.' },
      { word: 'borrow something', meaning: 'To use something and give it back', example: 'Can I borrow some sugar?' },
      { word: 'shared garden', meaning: 'A garden used by more than one home', example: 'We have a shared garden.' },
    ],
    pronunciationTip: '"Neighbour" has a silent "gh" — say "NAY-buh".',
    conversation: [
      { speaker: 'You', line: "Hi, I'm your new neighbour." },
      { speaker: 'Neighbour', line: 'Nice to meet you! Welcome to the street.' },
    ],
    quiz: [
      { id: 'neighbours-1', question: 'What is someone who lives near you called?', options: ['Neighbour', 'Tenant', 'Landlord'], correctIndex: 0 },
      { id: 'neighbours-2', question: 'What does "next door" mean?', options: ['The house beside yours', 'Far away', 'In another city'], correctIndex: 0 },
      { id: 'neighbours-3', question: 'What is the opposite of "quiet"?', options: ['Noisy', 'Friendly', 'Kind'], correctIndex: 0 },
    ],
  },
  {
    key: 'emergency_999',
    icon: 'alert-triangle',
    title: 'Emergencies — Calling 999',
    vocabulary: [
      { word: 'emergency', meaning: 'A serious, urgent situation', example: 'This is an emergency.' },
      { word: 'ambulance / fire brigade / police', meaning: 'Emergency services', example: 'Please send an ambulance.' },
      { word: 'Which service do you need?', meaning: 'What 999 operators ask', example: 'Which service do you need — police, fire, or ambulance?' },
      { word: "What's your address?", meaning: 'What operators ask next', example: "What's your address?" },
    
      { word: 'accident', meaning: 'An unexpected harmful event', example: 'There has been an accident.' },
      { word: 'Stay on the line', meaning: 'Instruction to keep talking to the operator', example: 'Please stay on the line.' },
      { word: "It's urgent", meaning: 'Saying something needs immediate attention', example: "Please hurry, it's urgent." },
    ],
    pronunciationTip: 'Speak calmly and clearly on emergency calls — say your address slowly, one word at a time.',
    conversation: [
      { speaker: 'Operator', line: 'Emergency, which service do you need?' },
      { speaker: 'You', line: 'Ambulance, please. My husband has fallen.' },
      { speaker: 'Operator', line: "What's your address?" },
      { speaker: 'You', line: "It's 12 Green Street, London." },
    ],
    quiz: [
      { id: 'emergency-1', question: 'What number do you call for an emergency in the UK?', options: ['999', '111', '101'], correctIndex: 0 },
      { id: 'emergency-2', question: 'Which is an emergency service?', options: ['Ambulance', 'Post office', 'Supermarket'], correctIndex: 0 },
      { id: 'emergency-3', question: 'What will the operator ask first?', options: ['Which service do you need?', 'What is your name?', 'What is the weather?'], correctIndex: 0 },
    ],
  },
  {
    key: 'hospital',
    icon: 'plus-square',
    title: 'At the Hospital',
    vocabulary: [
      { word: 'A&E', meaning: 'Accident and Emergency department', example: 'We went to A&E last night.' },
      { word: 'nurse / surgeon', meaning: 'Hospital staff', example: 'The nurse checked my blood pressure.' },
      { word: 'ward', meaning: 'A room with hospital beds', example: 'My father is in ward 4.' },
      { word: 'visiting hours', meaning: 'When you can visit a patient', example: 'What are the visiting hours?' },
    
      { word: 'operation / surgery', meaning: 'A medical procedure', example: 'She needs an operation.' },
      { word: 'discharge', meaning: 'To be allowed to leave hospital', example: 'He was discharged yesterday.' },
      { word: 'test results', meaning: 'Findings from a medical test', example: 'When will the test results be ready?' },
    ],
    pronunciationTip: '"A&E" is said as three separate letters: "ay-and-ee".',
    conversation: [
      { speaker: 'You', line: 'Excuse me, what are the visiting hours for ward 4?' },
      { speaker: 'Staff', line: "It's from 2pm to 4pm." },
    ],
    quiz: [
      { id: 'hospital-1', question: 'What does A&E stand for in the UK?', options: ['Accident and Emergency', 'Ask and Explain', 'All and Every'], correctIndex: 0 },
      { id: 'hospital-2', question: 'What is a room with hospital beds called?', options: ['Ward', 'Aisle', 'Platform'], correctIndex: 0 },
      { id: 'hospital-3', question: 'Who checks your health in hospital?', options: ['Nurse', 'Tenant', 'Landlord'], correctIndex: 0 },
    ],
  },
  {
    key: 'describing_symptoms',
    icon: 'thermometer',
    title: 'Describing Symptoms',
    vocabulary: [
      { word: 'fever / cough', meaning: 'Common symptoms', example: 'I have a fever and a cough.' },
      { word: 'sore throat', meaning: 'Pain in the throat', example: 'I have a sore throat.' },
      { word: 'dizzy / sick', meaning: 'Feeling unwell', example: "I feel dizzy." },
      { word: 'How long have you had this?', meaning: 'What a doctor might ask', example: 'How long have you had this cough?' },
    
      { word: 'rash', meaning: 'A red mark or irritation on skin', example: 'I have a rash on my arm.' },
      { word: 'swollen', meaning: 'Larger than normal due to injury or illness', example: 'My ankle is swollen.' },
      { word: 'It hurts when I...', meaning: 'Describing pain triggers', example: 'It hurts when I walk.' },
    ],
    pronunciationTip: '"Sore" and "saw" sound the same in British English — context tells the listener which you mean.',
    conversation: [
      { speaker: 'Doctor', line: 'What are your symptoms?' },
      { speaker: 'You', line: 'I have a fever and a sore throat.' },
      { speaker: 'Doctor', line: 'How long have you had this?' },
      { speaker: 'You', line: 'Since Monday.' },
    ],
    quiz: [
      { id: 'symptoms-1', question: 'Which is a symptom?', options: ['Fever', 'Balance', 'Discount'], correctIndex: 0 },
      { id: 'symptoms-2', question: 'What does "dizzy" mean?', options: ['Feeling unsteady', 'Feeling happy', 'Feeling hungry'], correctIndex: 0 },
      { id: 'symptoms-3', question: 'What might a doctor ask about symptoms?', options: ['How long have you had this?', 'What is your address?', 'How much is this?'], correctIndex: 0 },
    ],
  },
  {
    key: 'dentist',
    icon: 'smile',
    title: 'At the Dentist',
    vocabulary: [
      { word: 'toothache', meaning: 'Pain in a tooth', example: 'I have a toothache.' },
      { word: 'dentist / checkup', meaning: 'Tooth doctor and routine visit', example: 'I have a dentist checkup tomorrow.' },
      { word: 'filling', meaning: 'A repair for a tooth', example: 'I need a filling.' },
      { word: 'brush your teeth', meaning: 'Cleaning your teeth', example: 'Brush your teeth twice a day.' },
    
      { word: 'wisdom tooth', meaning: 'A back tooth that grows in adulthood', example: 'My wisdom tooth hurts.' },
      { word: 'X-ray', meaning: 'An image used to check inside the body', example: 'The dentist took an X-ray.' },
      { word: 'sensitive teeth', meaning: 'Teeth that react to hot or cold', example: 'I have sensitive teeth.' },
    ],
    pronunciationTip: '"Toothache" is stressed on "tooth", and the "ache" sounds like "ake" (a hard k sound).',
    conversation: [
      { speaker: 'You', line: 'I have a toothache. Can I book a checkup?' },
      { speaker: 'Receptionist', line: 'Yes, we have an appointment on Thursday.' },
    ],
    quiz: [
      { id: 'dentist-1', question: 'What is pain in a tooth called?', options: ['Toothache', 'Headache', 'Backache'], correctIndex: 0 },
      { id: 'dentist-2', question: 'What repairs a damaged tooth?', options: ['Filling', 'Bill', 'Recipe'], correctIndex: 0 },
      { id: 'dentist-3', question: 'What should you do twice a day for your teeth?', options: ['Brush them', 'Cook them', 'Wash them in a pan'], correctIndex: 0 },
    ],
  },
  {
    key: 'opticians',
    icon: 'eye',
    title: 'At the Opticians',
    vocabulary: [
      { word: 'eye test', meaning: 'A check of your eyesight', example: "I'm booking an eye test." },
      { word: 'glasses / contact lenses', meaning: 'Ways to correct eyesight', example: 'I wear glasses for reading.' },
      { word: 'blurry vision', meaning: 'Not seeing clearly', example: 'I have blurry vision sometimes.' },
      { word: 'reading glasses', meaning: 'Glasses for close-up reading', example: 'I need reading glasses.' },
    
      { word: 'short-sighted / long-sighted', meaning: 'Types of vision problems', example: "I'm short-sighted." },
      { word: 'prescription (glasses)', meaning: 'The lens strength you need', example: 'My prescription has changed.' },
      { word: 'frames', meaning: 'The part of glasses that holds the lenses', example: 'I like these frames.' },
    ],
    pronunciationTip: '"Opticians" is stressed on the second part: "op-TISH-ans".',
    conversation: [
      { speaker: 'You', line: "I'd like to book an eye test, please." },
      { speaker: 'Optician', line: 'Of course. Do you have any problems with your vision?' },
      { speaker: 'You', line: 'Yes, my vision is a bit blurry.' },
    ],
    quiz: [
      { id: 'opticians-1', question: 'What checks your eyesight?', options: ['Eye test', 'Blood test', 'Hearing test'], correctIndex: 0 },
      { id: 'opticians-2', question: 'What do people wear to see better?', options: ['Glasses', 'Gloves', 'Coat'], correctIndex: 0 },
      { id: 'opticians-3', question: 'What does "blurry vision" mean?', options: ['Not seeing clearly', 'Seeing very well', 'Not hearing well'], correctIndex: 0 },
    ],
  },
  {
    key: 'airport',
    icon: 'send',
    title: 'At the Airport',
    vocabulary: [
      { word: 'check-in / boarding pass', meaning: 'Airport procedures', example: 'Where is check-in?' },
      { word: 'luggage / suitcase', meaning: 'What you travel with', example: 'My suitcase is heavy.' },
      { word: 'departure / arrival', meaning: 'Leaving and arriving', example: 'The departure gate is 12.' },
      { word: 'passport control', meaning: 'Where documents are checked', example: 'Passport control is over there.' },
    
      { word: 'security check', meaning: 'Where bags and people are checked', example: 'The security check was quick.' },
      { word: 'gate number', meaning: 'Where you board the plane', example: "What's the gate number?" },
      { word: 'delayed flight', meaning: 'A flight leaving later than planned', example: 'Our flight is delayed.' },
    ],
    pronunciationTip: '"Luggage" rhymes with "hug-idge" — the stress is on the first part.',
    conversation: [
      { speaker: 'You', line: 'Excuse me, where is check-in for flight BA123?' },
      { speaker: 'Staff', line: "It's over there, desk 15." },
    ],
    quiz: [
      { id: 'airport-1', question: 'Where do you check your travel documents?', options: ['Passport control', 'Checkout', 'Ward'], correctIndex: 0 },
      { id: 'airport-2', question: 'What do you carry your clothes in when travelling?', options: ['Suitcase', 'Trolley', 'Basket'], correctIndex: 0 },
      { id: 'airport-3', question: 'What is the opposite of "arrival"?', options: ['Departure', 'Boarding', 'Check-in'], correctIndex: 0 },
    ],
  },
  {
    key: 'booking_tickets',
    icon: 'bookmark',
    title: 'Booking Tickets',
    vocabulary: [
      { word: 'single / return ticket', meaning: 'One-way or round-trip', example: "I'd like a return ticket, please." },
      { word: 'book online', meaning: 'Reserving over the internet', example: 'I booked the ticket online.' },
      { word: 'confirmation email', meaning: 'Proof of booking', example: 'Check your confirmation email.' },
      { word: 'How much is a ticket to...?', meaning: 'Asking the ticket price', example: 'How much is a ticket to Leeds?' },
    
      { word: 'discounted ticket', meaning: 'A ticket at a reduced price', example: 'Is there a discounted ticket for students?' },
      { word: 'seat number', meaning: 'Your assigned seat', example: "What's my seat number?" },
      { word: 'change my booking', meaning: 'To alter an existing booking', example: "I'd like to change my booking." },
    ],
    pronunciationTip: '"Return" is stressed on the second part: "re-TURN".',
    conversation: [
      { speaker: 'You', line: "I'd like a return ticket to Leeds, please." },
      { speaker: 'Staff', line: "That's £24.50." },
    ],
    quiz: [
      { id: 'tickets-1', question: 'What kind of ticket do you need for a round trip?', options: ['Single', 'Return', 'One-way'], correctIndex: 1 },
      { id: 'tickets-2', question: 'What proves you booked something online?', options: ['Confirmation email', 'A receipt only', 'Nothing'], correctIndex: 0 },
      { id: 'tickets-3', question: 'How do you ask the price of a ticket?', options: ['How much is a ticket to...?', 'Ticket where?', 'Give ticket'], correctIndex: 0 },
    ],
  },
  {
    key: 'hotel_checkin',
    icon: 'key',
    title: 'Hotel Check-in',
    vocabulary: [
      { word: 'reservation', meaning: 'A booking', example: 'I have a reservation for two nights.' },
      { word: 'check-in / check-out time', meaning: 'Arrival and departure time at a hotel', example: 'Check-in is from 3pm.' },
      { word: 'room key', meaning: 'What opens your room', example: 'Here is your room key.' },
      { word: 'Is breakfast included?', meaning: 'Asking about hotel meals', example: 'Is breakfast included in the price?' },
    
      { word: 'single / double room', meaning: 'Room types', example: "I'd like a double room, please." },
      { word: 'wake-up call', meaning: 'A reminder call to wake you', example: 'Could I have a wake-up call at 7am?' },
      { word: 'complimentary', meaning: 'Provided free of charge', example: 'Breakfast is complimentary.' },
    ],
    pronunciationTip: '"Reservation" is stressed on the third part: "reh-zer-VAY-shun".',
    conversation: [
      { speaker: 'You', line: 'Hello, I have a reservation under the name Khan.' },
      { speaker: 'Receptionist', line: 'Yes, room 302. Here is your room key.' },
      { speaker: 'You', line: 'Thank you. Is breakfast included?' },
    ],
    quiz: [
      { id: 'hotel-1', question: 'What word means "a booking"?', options: ['Reservation', 'Deposit', 'Bill'], correctIndex: 0 },
      { id: 'hotel-2', question: 'What opens your hotel room?', options: ['Room key', 'Ticket', 'Card'], correctIndex: 0 },
      { id: 'hotel-3', question: 'How do you ask about hotel meals?', options: ['Is breakfast included?', 'Where is breakfast?', 'Breakfast now?'], correctIndex: 0 },
    ],
  },
  {
    key: 'asking_permission',
    icon: 'help-circle',
    title: 'Asking Permission',
    vocabulary: [
      { word: 'Can I...? / May I...?', meaning: 'Asking permission', example: 'Can I open the window?' },
      { word: 'Is it OK if...?', meaning: 'A softer way to ask permission', example: 'Is it OK if I leave early?' },
      { word: 'Of course / Sure', meaning: 'Giving permission', example: 'Of course, go ahead.' },
      { word: "I'm afraid not", meaning: 'Politely refusing permission', example: "I'm afraid not, sorry." },
    
      { word: 'Would it be OK to...?', meaning: 'A polite way to ask permission', example: 'Would it be OK to leave early?' },
      { word: 'Do you mind if...?', meaning: 'Asking permission politely', example: 'Do you mind if I open the window?' },
      { word: 'Go ahead', meaning: 'Giving permission', example: "Go ahead, that's fine." },
    ],
    pronunciationTip: '"May I" sounds more formal than "Can I" — both are correct, but "May I" is often used with strangers.',
    conversation: [
      { speaker: 'You', line: 'Excuse me, is it OK if I sit here?' },
      { speaker: 'Stranger', line: 'Of course, go ahead.' },
    ],
    quiz: [
      { id: 'permission-1', question: 'How do you ask permission formally?', options: ['May I...?', 'I want...', 'Give me...'], correctIndex: 0 },
      { id: 'permission-2', question: 'How do you politely give permission?', options: ['Of course', 'No', 'Never'], correctIndex: 0 },
      { id: 'permission-3', question: 'How do you politely refuse permission?', options: ["I'm afraid not", 'No way', 'Never ask'], correctIndex: 0 },
    ],
  },
  {
    key: 'giving_advice',
    icon: 'info',
    title: 'Giving Advice',
    vocabulary: [
      { word: 'You should...', meaning: 'Giving advice', example: 'You should see a doctor.' },
      { word: 'Why don\'t you...?', meaning: 'Suggesting an idea', example: "Why don't you try the new clinic?" },
      { word: "If I were you, I'd...", meaning: 'Giving personal advice', example: "If I were you, I'd rest today." },
      { word: 'That\'s a good idea', meaning: 'Agreeing with advice', example: "That's a good idea, thank you." },
    
      { word: "It's a good idea to...", meaning: 'Suggesting a helpful action', example: "It's a good idea to book early." },
      { word: 'I recommend...', meaning: 'Suggesting something', example: 'I recommend this doctor.' },
      { word: 'try to...', meaning: 'Suggesting an attempt', example: 'Try to rest more.' },
    ],
    pronunciationTip: '"Should" has a silent "l" — say "shud", not "shold".',
    conversation: [
      { speaker: 'A', line: "I don't feel well." },
      { speaker: 'B', line: 'You should see a doctor.' },
      { speaker: 'A', line: "That's a good idea." },
    ],
    quiz: [
      { id: 'advice-1', question: 'How do you give advice?', options: ['You should...', 'You must never', 'I do not care'], correctIndex: 0 },
      { id: 'advice-2', question: 'How do you agree with advice?', options: ["That's a good idea", 'No way', 'I disagree'], correctIndex: 0 },
      { id: 'advice-3', question: 'Which is a way to suggest an idea?', options: ["Why don't you...?", 'You never...', 'Stop it'], correctIndex: 0 },
    ],
  },
  {
    key: 'apologising',
    icon: 'frown',
    title: 'Apologising',
    vocabulary: [
      { word: "I'm sorry", meaning: 'A basic apology', example: "I'm sorry I'm late." },
      { word: 'Excuse me', meaning: 'Used before interrupting or bumping into someone', example: 'Excuse me, sorry about that.' },
      { word: "It won't happen again", meaning: 'Promising to not repeat a mistake', example: "I'm sorry, it won't happen again." },
      { word: "That's OK / No problem", meaning: 'Accepting an apology', example: "That's OK, don't worry." },
    
      { word: 'My apologies', meaning: 'A formal apology', example: 'My apologies for the delay.' },
      { word: "I didn't mean to", meaning: 'Saying something was not intentional', example: "I didn't mean to upset you." },
      { word: 'my mistake', meaning: 'Admitting a personal error', example: 'Sorry, my mistake.' },
    ],
    pronunciationTip: '"Sorry" in British English often sounds like "SORR-ee", with a short "o", different from American English.',
    conversation: [
      { speaker: 'A', line: "I'm sorry I'm late." },
      { speaker: 'B', line: "That's OK, don't worry." },
    ],
    quiz: [
      { id: 'apology-1', question: 'How do you apologise?', options: ["I'm sorry", 'I am right', 'No problem'], correctIndex: 0 },
      { id: 'apology-2', question: 'How do you accept an apology?', options: ["That's OK", "I'm sorry", 'Excuse me'], correctIndex: 0 },
      { id: 'apology-3', question: 'What do you say before interrupting someone?', options: ['Excuse me', 'Goodbye', 'Never mind'], correctIndex: 0 },
    ],
  },
  {
    key: 'complaints',
    icon: 'alert-circle',
    title: 'Making a Complaint',
    vocabulary: [
      { word: "I'd like to complain about...", meaning: 'Starting a complaint', example: "I'd like to complain about the service." },
      { word: 'This is not working', meaning: 'Describing a problem', example: 'This is not working properly.' },
      { word: 'Could I have a refund?', meaning: 'Asking for money back', example: 'Could I have a refund, please?' },
      { word: "I'm not happy with...", meaning: 'Expressing dissatisfaction', example: "I'm not happy with this product." },
    
      { word: 'faulty', meaning: 'Not working correctly', example: 'This item is faulty.' },
      { word: 'unacceptable', meaning: 'Not good enough', example: 'This service is unacceptable.' },
      { word: 'speak to the manager', meaning: 'Asking to escalate a complaint', example: 'Could I speak to the manager?' },
    ],
    pronunciationTip: 'Keep your voice calm and polite when complaining — a steady tone gets better results than a loud one.',
    conversation: [
      { speaker: 'You', line: "I'd like to complain about this jacket. It's damaged." },
      { speaker: 'Staff', line: "I'm sorry to hear that. Would you like a refund or exchange?" },
      { speaker: 'You', line: 'A refund, please.' },
    ],
    quiz: [
      { id: 'complaints-1', question: 'How do you start a complaint politely?', options: ["I'd like to complain about...", 'This is terrible!', 'You are wrong'], correctIndex: 0 },
      { id: 'complaints-2', question: 'How do you ask for money back?', options: ['Could I have a refund?', 'Give me money', 'I want money now'], correctIndex: 0 },
      { id: 'complaints-3', question: 'Which phrase expresses dissatisfaction?', options: ["I'm not happy with...", "I'm very happy", 'Thank you'], correctIndex: 0 },
    ],
  },
  {
    key: 'thanking_someone',
    icon: 'heart',
    title: 'Thanking Someone',
    vocabulary: [
      { word: 'Thank you / Thanks', meaning: 'Basic ways to say thanks', example: 'Thank you very much.' },
      { word: 'I really appreciate it', meaning: 'A stronger way to say thanks', example: 'I really appreciate your help.' },
      { word: "You're welcome", meaning: 'A reply to "thank you"', example: "You're welcome." },
      { word: "Thanks for your help", meaning: 'Thanking someone for assistance', example: 'Thanks for your help today.' },
    
      { word: 'much appreciated', meaning: 'A phrase expressing gratitude', example: 'Much appreciated, thank you.' },
      { word: "I can't thank you enough", meaning: 'A strong thanks', example: "I can't thank you enough for your help." },
      { word: 'kind of you', meaning: 'Describing a generous action', example: "That's very kind of you." },
    ],
    pronunciationTip: '"Thank you" blends together in fast speech — it can sound like "THANG-kyoo".',
    conversation: [
      { speaker: 'A', line: 'Thanks for your help today.' },
      { speaker: 'B', line: "You're welcome, anytime." },
    ],
    quiz: [
      { id: 'thanks-1', question: 'How do you reply to "thank you"?', options: ["You're welcome", 'Thank you too', 'No'], correctIndex: 0 },
      { id: 'thanks-2', question: 'Which is a stronger way to say thanks?', options: ['I really appreciate it', 'Whatever', 'Fine'], correctIndex: 0 },
      { id: 'thanks-3', question: 'How do you thank someone for assistance?', options: ['Thanks for your help', 'Help me now', 'Sorry for help'], correctIndex: 0 },
    ],
  },
  {
    key: 'saying_goodbye',
    icon: 'log-out',
    title: 'Saying Goodbye',
    vocabulary: [
      { word: 'Goodbye / Bye', meaning: 'Common ways to say farewell', example: 'Goodbye, see you soon.' },
      { word: 'See you later / See you soon', meaning: 'Casual farewells', example: 'See you later!' },
      { word: 'Take care', meaning: 'A friendly farewell', example: 'Take care, bye!' },
      { word: 'Have a good day', meaning: 'A polite farewell', example: 'Have a good day!' },
    
      { word: 'until next time', meaning: 'A farewell suggesting a future meeting', example: 'Until next time, take care.' },
      { word: 'safe travels', meaning: 'Wishing someone a safe journey', example: 'Safe travels home!' },
      { word: 'it was nice seeing you', meaning: 'A polite farewell', example: 'It was nice seeing you.' },
    ],
    pronunciationTip: '"Goodbye" is stressed on the second part: "good-BYE".',
    conversation: [
      { speaker: 'A', line: "It was nice talking to you. I have to go now." },
      { speaker: 'B', line: 'Take care, see you soon!' },
    ],
    quiz: [
      { id: 'goodbye-1', question: 'Which is a casual way to say goodbye?', options: ['See you later', 'Nice to meet you', 'How are you?'], correctIndex: 0 },
      { id: 'goodbye-2', question: 'What is a friendly farewell?', options: ['Take care', 'Excuse me', 'Sorry'], correctIndex: 0 },
      { id: 'goodbye-3', question: 'Which is a polite farewell?', options: ['Have a good day', 'What do you do?', 'How much is it?'], correctIndex: 0 },
    ],
  },
  {
    key: 'weekend_plans',
    icon: 'sun',
    title: 'Weekend Plans',
    vocabulary: [
      { word: 'Any plans for the weekend?', meaning: 'Asking about future plans', example: 'Any plans for the weekend?' },
      { word: "I'm going to...", meaning: 'Describing a future plan', example: "I'm going to visit my family." },
      { word: 'nothing much / nothing special', meaning: 'Saying you have no plans', example: 'Nothing much, just relaxing.' },
      { word: 'sounds good / sounds fun', meaning: 'Reacting positively to a plan', example: 'That sounds fun!' },
    
      { word: 'do you have anything planned?', meaning: 'Asking about upcoming plans', example: 'Do you have anything planned?' },
      { word: 'catch up', meaning: 'To meet and talk after time apart', example: "Let's catch up this weekend." },
      { word: 'relaxing weekend', meaning: 'A calm, restful weekend', example: 'I had a relaxing weekend.' },
    ],
    pronunciationTip: '"Going to" is often shortened in speech to "gonna" — both are correct in casual conversation.',
    conversation: [
      { speaker: 'A', line: 'Any plans for the weekend?' },
      { speaker: 'B', line: "I'm going to visit my parents. What about you?" },
      { speaker: 'A', line: 'Nothing much, just relaxing.' },
    ],
    quiz: [
      { id: 'weekendplans-1', question: 'How do you ask about future plans?', options: ['Any plans for the weekend?', 'What did you do?', 'Where were you?'], correctIndex: 0 },
      { id: 'weekendplans-2', question: 'How do you describe a future plan?', options: ["I'm going to...", 'I went to...', 'I go...'], correctIndex: 0 },
      { id: 'weekendplans-3', question: 'How do you say you have no special plans?', options: ['Nothing much', 'Very busy', 'Every day'], correctIndex: 0 },
    ],
  },
  {
    key: 'public_holidays',
    icon: 'gift',
    title: 'Public Holidays',
    vocabulary: [
      { word: 'bank holiday', meaning: 'A UK public holiday', example: 'Monday is a bank holiday.' },
      { word: 'Christmas / New Year', meaning: 'Common UK holidays', example: 'We celebrate Christmas with family.' },
      { word: 'day off work', meaning: 'A holiday from work', example: 'I have a day off work on Monday.' },
      { word: 'Happy holidays!', meaning: 'A festive greeting', example: 'Happy holidays, everyone!' },
    
      { word: 'Easter', meaning: 'A UK spring public holiday', example: 'We have four days off at Easter.' },
      { word: 'close early / stay open', meaning: 'Shop hours on holidays', example: 'Shops close early on Christmas Eve.' },
      { word: 'celebrate', meaning: 'To mark a special occasion', example: 'We celebrate with family.' },
    ],
    pronunciationTip: '"Holiday" is stressed on the first part: "HOL-i-day".',
    conversation: [
      { speaker: 'A', line: 'Are you working on the bank holiday?' },
      { speaker: 'B', line: 'No, I have a day off work.' },
    ],
    quiz: [
      { id: 'holidays-1', question: 'What is a UK public holiday called?', options: ['Bank holiday', 'Work day', 'School day'], correctIndex: 0 },
      { id: 'holidays-2', question: 'Which is a common UK holiday?', options: ['Christmas', 'Monday', 'Weekday'], correctIndex: 0 },
      { id: 'holidays-3', question: 'What do you say to wish someone a good holiday?', options: ['Happy holidays!', 'Goodbye forever', 'Sorry'], correctIndex: 0 },
    ],
  },
  {
    key: 'birthday_celebration',
    icon: 'star',
    title: 'Birthdays and Celebrations',
    vocabulary: [
      { word: 'Happy birthday!', meaning: 'A birthday greeting', example: 'Happy birthday! Have a great day.' },
      { word: 'birthday cake / candles', meaning: 'Birthday items', example: 'We had a birthday cake with candles.' },
      { word: 'a present / a gift', meaning: 'Something given for a celebration', example: 'I bought her a present.' },
      { word: 'How old are you turning?', meaning: 'Asking about someone\'s new age', example: 'How old are you turning?' },
    
      { word: 'make a wish', meaning: 'A birthday cake tradition', example: 'Make a wish and blow out the candles.' },
      { word: 'birthday card', meaning: 'A card given for a birthday', example: 'I bought her a birthday card.' },
      { word: 'surprise party', meaning: 'A party the person does not expect', example: 'We planned a surprise party.' },
    ],
    pronunciationTip: '"Birthday" is stressed on the first part: "BIRTH-day".',
    conversation: [
      { speaker: 'A', line: 'Happy birthday! How old are you turning?' },
      { speaker: 'B', line: "Thank you! I'm turning thirty." },
    ],
    quiz: [
      { id: 'birthday-1', question: 'What do you say on someone\'s birthday?', options: ['Happy birthday!', 'Good luck!', 'Excuse me!'], correctIndex: 0 },
      { id: 'birthday-2', question: 'What is something given for a celebration called?', options: ['A present', 'A bill', 'A fare'], correctIndex: 0 },
      { id: 'birthday-3', question: 'What do you often see on a birthday cake?', options: ['Candles', 'Stamps', 'Tickets'], correctIndex: 0 },
    ],
  },
  {
    key: 'wedding',
    icon: 'heart',
    title: 'Weddings',
    vocabulary: [
      { word: 'wedding', meaning: 'A marriage ceremony', example: 'We are going to a wedding on Saturday.' },
      { word: 'bride / groom', meaning: 'The couple getting married', example: 'The bride looked beautiful.' },
      { word: 'congratulations', meaning: 'What you say to celebrate good news', example: 'Congratulations on your wedding!' },
      { word: 'invited to a wedding', meaning: 'Being asked to attend', example: 'We were invited to a wedding.' },
    
      { word: 'wedding ring', meaning: 'A ring worn to show marriage', example: 'She showed us her wedding ring.' },
      { word: 'guest', meaning: 'Someone invited to an event', example: 'We were guests at the wedding.' },
      { word: 'anniversary', meaning: 'The date marking a past wedding', example: 'Happy anniversary!' },
    ],
    pronunciationTip: '"Congratulations" is a long word — break it into parts: "con-GRAT-yoo-LAY-shuns".',
    conversation: [
      { speaker: 'A', line: 'We got married last month.' },
      { speaker: 'B', line: 'Congratulations! That\'s wonderful news.' },
    ],
    quiz: [
      { id: 'wedding-1', question: 'What do you say to celebrate a marriage?', options: ['Congratulations!', 'Sorry!', 'Excuse me!'], correctIndex: 0 },
      { id: 'wedding-2', question: 'Who is the man getting married called?', options: ['Groom', 'Bride', 'Guest'], correctIndex: 0 },
      { id: 'wedding-3', question: 'What is a marriage ceremony called?', options: ['A wedding', 'A birthday', 'A holiday'], correctIndex: 0 },
    ],
  },
  {
    key: 'council_services',
    icon: 'flag',
    title: 'Local Council Services',
    vocabulary: [
      { word: 'council', meaning: 'Local government for your area', example: 'I contacted the council about the bins.' },
      { word: 'council tax', meaning: 'A local tax for services', example: 'I pay council tax every month.' },
      { word: 'report a problem', meaning: 'Telling the council about an issue', example: "I'd like to report a problem with the street light." },
      { word: 'local services', meaning: 'Services provided in your area', example: 'The council provides local services like bin collection.' },
    
      { word: 'apply for housing', meaning: 'Requesting council housing support', example: "I'd like to apply for housing." },
      { word: 'benefits', meaning: 'Financial support from the government', example: 'She receives housing benefits.' },
      { word: 'council office', meaning: 'The local government building', example: 'The council office is in town.' },
    ],
    pronunciationTip: '"Council" is stressed on the first part: "COUN-sil".',
    conversation: [
      { speaker: 'You', line: "I'd like to report a broken street light." },
      { speaker: 'Council staff', line: 'Thank you, could I take your address?' },
    ],
    quiz: [
      { id: 'council-1', question: 'What is local government called?', options: ['Council', 'Landlord', 'Bank'], correctIndex: 0 },
      { id: 'council-2', question: 'What tax pays for local services?', options: ['Council tax', 'Income tax', 'Sales tax'], correctIndex: 0 },
      { id: 'council-3', question: 'How do you tell the council about an issue?', options: ['Report a problem', 'Ignore it', 'Pay a bill'], correctIndex: 0 },
    ],
  },
  {
    key: 'library',
    icon: 'book',
    title: 'At the Library',
    vocabulary: [
      { word: 'library card', meaning: 'A card to borrow books', example: "I'd like to get a library card." },
      { word: 'borrow a book', meaning: 'Taking a book to use temporarily', example: 'I want to borrow this book.' },
      { word: 'return date', meaning: 'When a book must be given back', example: "What's the return date?" },
      { word: 'renew', meaning: 'To extend the borrowing time', example: 'Can I renew this book?' },
    
      { word: 'reference section', meaning: 'Books that cannot be borrowed', example: 'This book is in the reference section.' },
      { word: 'quiet area', meaning: 'A place for silent reading', example: 'This is a quiet area.' },
      { word: 'overdue book', meaning: 'A book returned late', example: 'I have an overdue book.' },
    ],
    pronunciationTip: '"Library" has three syllables: "LY-brer-ee" — many learners drop the middle "r".',
    conversation: [
      { speaker: 'You', line: "I'd like to borrow this book, please." },
      { speaker: 'Librarian', line: 'Do you have a library card?' },
      { speaker: 'You', line: 'Yes, here it is.' },
    ],
    quiz: [
      { id: 'library-1', question: 'What do you need to borrow books?', options: ['Library card', 'Passport', 'Ticket'], correctIndex: 0 },
      { id: 'library-2', question: 'What does "renew" mean at a library?', options: ['Extend the borrowing time', 'Return it early', 'Lose it'], correctIndex: 0 },
      { id: 'library-3', question: 'What is the date a book must be returned called?', options: ['Return date', 'Due bill', 'Ticket date'], correctIndex: 0 },
    ],
  },
  {
    key: 'museum',
    icon: 'image',
    title: 'At the Museum',
    vocabulary: [
      { word: 'exhibition', meaning: 'A display of items', example: 'There is a new exhibition this month.' },
      { word: 'entry fee', meaning: 'The cost to enter', example: 'Is there an entry fee?' },
      { word: 'guided tour', meaning: 'A tour led by a guide', example: "I'd like to join the guided tour." },
      { word: 'opening times', meaning: 'When a place is open', example: "What are the opening times?" },
    
      { word: 'artefact', meaning: 'A historical object on display', example: 'This artefact is very old.' },
      { word: 'gift shop', meaning: 'A shop selling souvenirs', example: "Let's visit the gift shop." },
      { word: 'free entry', meaning: 'No charge to enter', example: 'The museum has free entry.' },
    ],
    pronunciationTip: '"Exhibition" is stressed on the third part: "ex-hi-BI-shun".',
    conversation: [
      { speaker: 'You', line: 'Is there an entry fee for the museum?' },
      { speaker: 'Staff', line: 'No, entry is free, but the exhibition is £5.' },
    ],
    quiz: [
      { id: 'museum-1', question: 'What is a display of items called?', options: ['Exhibition', 'Ward', 'Aisle'], correctIndex: 0 },
      { id: 'museum-2', question: 'What do you call a tour led by a guide?', options: ['Guided tour', 'Self tour', 'Free tour'], correctIndex: 0 },
      { id: 'museum-3', question: 'How do you ask when a place is open?', options: ['What are the opening times?', 'Where is it?', 'How much is it?'], correctIndex: 0 },
    ],
  },
  {
    key: 'park',
    icon: 'sun',
    title: 'At the Park',
    vocabulary: [
      { word: 'park / playground', meaning: 'Outdoor public spaces', example: 'We take the children to the park.' },
      { word: 'bench', meaning: 'A seat outdoors', example: 'Let\'s sit on that bench.' },
      { word: 'go for a jog', meaning: 'To run for exercise', example: 'I go for a jog every morning.' },
      { word: 'feed the ducks', meaning: 'A common park activity', example: 'We fed the ducks at the pond.' },
    
      { word: 'picnic', meaning: 'A meal eaten outdoors', example: "Let's have a picnic in the park." },
      { word: 'swings / slide', meaning: 'Playground equipment', example: 'The kids love the swings.' },
      { word: 'dog walking', meaning: 'Taking a dog for exercise', example: 'I go dog walking every evening.' },
    ],
    pronunciationTip: '"Jog" has a short "o" sound, like in "dog" — say "jog", not "joag".',
    conversation: [
      { speaker: 'A', line: 'Shall we take the kids to the park?' },
      { speaker: 'B', line: 'Good idea, they can feed the ducks.' },
    ],
    quiz: [
      { id: 'park-1', question: 'Where do children usually play outdoors?', options: ['Playground', 'Bank', 'Library'], correctIndex: 0 },
      { id: 'park-2', question: 'What is running for exercise called?', options: ['Jogging', 'Walking slowly', 'Sitting'], correctIndex: 0 },
      { id: 'park-3', question: 'What do you sit on outdoors?', options: ['A bench', 'A sofa', 'A wardrobe'], correctIndex: 0 },
    ],
  },
  {
    key: 'weather_forecast',
    icon: 'cloud-rain',
    title: 'The Weather Forecast',
    vocabulary: [
      { word: 'forecast', meaning: 'A prediction of future weather', example: "What's the forecast for tomorrow?" },
      { word: 'It will rain / It will be sunny', meaning: 'Talking about future weather', example: 'It will rain this afternoon.' },
      { word: 'chance of rain', meaning: 'Probability of rain', example: "There's a chance of rain later." },
      { word: 'temperature', meaning: 'How hot or cold it is', example: 'The temperature is 15 degrees.' },
    
      { word: 'heavy rain / light rain', meaning: 'Rain intensity', example: 'There will be heavy rain tomorrow.' },
      { word: 'clear skies', meaning: 'No clouds', example: 'We should have clear skies today.' },
      { word: 'sunny spells', meaning: 'Short periods of sunshine', example: 'Expect sunny spells this afternoon.' },
    ],
    pronunciationTip: '"Forecast" is stressed on the first part: "FOR-cast".',
    conversation: [
      { speaker: 'A', line: "What's the forecast for tomorrow?" },
      { speaker: 'B', line: "It will be cloudy with a chance of rain." },
    ],
    quiz: [
      { id: 'forecast-1', question: 'What is a prediction of future weather called?', options: ['Forecast', 'Report', 'Bill'], correctIndex: 0 },
      { id: 'forecast-2', question: 'How do you talk about future weather?', options: ['It will rain', 'It rained', 'It rains yesterday'], correctIndex: 0 },
      { id: 'forecast-3', question: 'What measures how hot or cold it is?', options: ['Temperature', 'Balance', 'Fare'], correctIndex: 0 },
    ],
  },
  {
    key: 'clothes_for_weather',
    icon: 'umbrella',
    title: 'Clothes for the Weather',
    vocabulary: [
      { word: 'raincoat / umbrella', meaning: 'Items for rainy weather', example: 'Take an umbrella, it might rain.' },
      { word: 'sunglasses / sun hat', meaning: 'Items for sunny weather', example: "I need my sunglasses today." },
      { word: 'gloves / scarf', meaning: 'Items for cold weather', example: 'Wear gloves, it\'s freezing.' },
      { word: 'dress warmly', meaning: 'Wearing enough for cold weather', example: 'Dress warmly, it\'s cold outside.' },
    
      { word: 'waterproof', meaning: 'Not letting water through', example: 'This jacket is waterproof.' },
      { word: 'layers', meaning: 'Multiple items of clothing worn together', example: "Wear layers, it's cold." },
      { word: 'wellies (wellington boots)', meaning: 'Waterproof rubber boots', example: "Wear your wellies, it's muddy." },
    ],
    pronunciationTip: '"Scarf" has a short "a" sound in British English, like in "car" but shorter — "skahf".',
    conversation: [
      { speaker: 'A', line: "It's very cold today." },
      { speaker: 'B', line: 'Yes, dress warmly — take your gloves and a scarf.' },
    ],
    quiz: [
      { id: 'weatherclothes-1', question: 'What do you wear when it rains?', options: ['Raincoat', 'Sunglasses', 'Sun hat'], correctIndex: 0 },
      { id: 'weatherclothes-2', question: 'What do you wear on your hands when it is cold?', options: ['Gloves', 'Sunglasses', 'Scarf'], correctIndex: 0 },
      { id: 'weatherclothes-3', question: 'What does "dress warmly" mean?', options: ['Wear enough clothes for cold weather', 'Wear light clothes', 'Wear no coat'], correctIndex: 0 },
    ],
  },
  {
    key: 'describing_your_home',
    icon: 'home',
    title: 'Describing Your Home',
    vocabulary: [
      { word: 'flat / house', meaning: 'Types of home', example: 'I live in a flat.' },
      { word: 'How many rooms does it have?', meaning: 'Asking about a home\'s size', example: 'How many rooms does your flat have?' },
      { word: 'It has... bedrooms', meaning: 'Describing a home', example: 'It has two bedrooms and a kitchen.' },
      { word: 'ground floor / first floor', meaning: 'Describing which floor', example: 'My flat is on the first floor.' },
    
      { word: 'spacious / cosy', meaning: 'Describing the feel of a home', example: 'Our flat is small but cosy.' },
      { word: 'balcony', meaning: 'An outdoor platform on a building', example: 'We have a small balcony.' },
      { word: 'move house', meaning: 'To relocate to a new home', example: 'We are moving house next month.' },
    ],
    pronunciationTip: '"Floor" and "flaw" sound the same in British English — the context makes the meaning clear.',
    conversation: [
      { speaker: 'A', line: 'Can you describe your home?' },
      { speaker: 'B', line: 'It\'s a flat with two bedrooms, on the first floor.' },
    ],
    quiz: [
      { id: 'home-1', question: 'How do you ask about a home\'s size?', options: ['How many rooms does it have?', 'Where is your home?', 'What colour is it?'], correctIndex: 0 },
      { id: 'home-2', question: 'What is a type of home?', options: ['Flat', 'Bank', 'Library'], correctIndex: 0 },
      { id: 'home-3', question: 'What describes which level a flat is on?', options: ['First floor', 'First name', 'First aid'], correctIndex: 0 },
    ],
  },
  {
    key: 'describing_your_town',
    icon: 'map-pin',
    title: 'Describing Your Town',
    vocabulary: [
      { word: 'city / town / village', meaning: 'Sizes of places', example: 'I live in a small town.' },
      { word: 'What is it like?', meaning: 'Asking someone to describe a place', example: "What's your town like?" },
      { word: 'busy / quiet', meaning: 'Describing a place\'s atmosphere', example: 'It\'s a busy city.' },
      { word: 'famous for...', meaning: 'What a place is known for', example: 'It is famous for its market.' },
    
      { word: 'suburb', meaning: 'A residential area outside the centre', example: 'I live in a quiet suburb.' },
      { word: 'city centre', meaning: 'The middle of a city', example: 'The shops are in the city centre.' },
      { word: 'friendly community', meaning: 'A place with welcoming people', example: "It's a friendly community." },
    ],
    pronunciationTip: '"Village" is stressed on the first part: "VIL-idge".',
    conversation: [
      { speaker: 'A', line: "What's your hometown like?" },
      { speaker: 'B', line: "It's a small, quiet town, famous for its old market." },
    ],
    quiz: [
      { id: 'town-1', question: 'Which is the smallest place?', options: ['Village', 'City', 'Country'], correctIndex: 0 },
      { id: 'town-2', question: 'How do you ask someone to describe a place?', options: ['What is it like?', 'Where is it?', 'Who is it?'], correctIndex: 0 },
      { id: 'town-3', question: 'What does "famous for" mean?', options: ['Known for something', 'Unknown', 'Forgotten'], correctIndex: 0 },
    ],
  },
  {
    key: 'giving_your_address',
    icon: 'map',
    title: 'Giving Your Address',
    vocabulary: [
      { word: "What's your address?", meaning: 'Asking for an address', example: "What's your address?" },
      { word: 'street / road', meaning: 'Parts of an address', example: 'I live on Green Street.' },
      { word: 'postcode', meaning: 'The code at the end of a UK address', example: 'My postcode is SW1 1AA.' },
      { word: 'flat number', meaning: 'Which flat in a building', example: 'It is flat number 4.' },
    
      { word: 'building name / number', meaning: 'Parts of a UK address', example: 'The building number is 45.' },
      { word: 'town / city', meaning: 'Larger parts of an address', example: 'I live in the town of Reading.' },
      { word: 'nearest landmark', meaning: 'A well-known place nearby', example: 'The nearest landmark is the church.' },
    ],
    pronunciationTip: 'Spell out your postcode letter by letter and number by number, clearly and slowly.',
    conversation: [
      { speaker: 'A', line: "What's your address?" },
      { speaker: 'B', line: "It's flat 4, 12 Green Street, postcode SW1 1AA." },
    ],
    quiz: [
      { id: 'address-1', question: 'What is the code at the end of a UK address called?', options: ['Postcode', 'Passport number', 'Reference'], correctIndex: 0 },
      { id: 'address-2', question: 'How do you ask for an address?', options: ["What's your address?", 'Where you?', 'Address what?'], correctIndex: 0 },
      { id: 'address-3', question: 'Which word describes a type of road?', options: ['Street', 'Postcode', 'Flat number'], correctIndex: 0 },
    ],
  },
  {
    key: 'filling_in_forms',
    icon: 'file-text',
    title: 'Filling in Forms',
    vocabulary: [
      { word: 'full name', meaning: 'Your complete name', example: 'Please write your full name.' },
      { word: 'date of birth', meaning: 'The day you were born', example: 'What is your date of birth?' },
      { word: 'sign here', meaning: 'Where to put your signature', example: 'Please sign here.' },
      { word: 'block capitals', meaning: 'Writing in capital letters', example: 'Please write in block capitals.' },
    
      { word: 'tick the box', meaning: 'Marking a checkbox on a form', example: 'Please tick the box that applies.' },
      { word: 'leave blank', meaning: 'Not writing anything in a section', example: 'Leave this section blank.' },
      { word: 'section / page', meaning: 'Parts of a form', example: 'Complete section two.' },
    ],
    pronunciationTip: '"Signature" is stressed on the first part: "SIG-na-cher".',
    conversation: [
      { speaker: 'Staff', line: 'Please fill in your full name and date of birth.' },
      { speaker: 'You', line: 'Where do I sign?' },
      { speaker: 'Staff', line: 'Sign here, please, in block capitals.' },
    ],
    quiz: [
      { id: 'forms-1', question: 'What does "date of birth" mean?', options: ['The day you were born', 'Today\'s date', 'Your age'], correctIndex: 0 },
      { id: 'forms-2', question: 'What do you do at the bottom of a form?', options: ['Sign here', 'Read it', 'Fold it'], correctIndex: 0 },
      { id: 'forms-3', question: 'What does "block capitals" mean?', options: ['Writing in capital letters', 'Writing small', 'Writing in colour'], correctIndex: 0 },
    ],
  },
  {
    key: 'personal_information',
    icon: 'user-check',
    title: 'Personal Information',
    vocabulary: [
      { word: 'National Insurance number', meaning: 'A UK personal reference number', example: 'What is your National Insurance number?' },
      { word: 'nationality', meaning: 'The country you belong to', example: 'My nationality is Nigerian.' },
      { word: 'marital status', meaning: 'Whether you are married or single', example: 'What is your marital status?' },
      { word: 'occupation', meaning: 'Your job', example: 'What is your occupation?' },
    
      { word: 'place of birth', meaning: 'Where you were born', example: 'What is your place of birth?' },
      { word: 'next of kin', meaning: 'Your closest relative', example: 'Who is your next of kin?' },
      { word: 'emergency contact', meaning: 'Someone to contact in an emergency', example: 'Please give an emergency contact.' },
    ],
    pronunciationTip: '"Occupation" is stressed on the third part: "ok-yoo-PAY-shun".',
    conversation: [
      { speaker: 'Staff', line: 'Can I confirm your nationality and occupation?' },
      { speaker: 'You', line: "I'm Pakistani, and I work as a teacher." },
    ],
    quiz: [
      { id: 'personal-1', question: 'What does "nationality" mean?', options: ['The country you belong to', 'Your job', 'Your address'], correctIndex: 0 },
      { id: 'personal-2', question: 'What does "occupation" mean?', options: ['Your job', 'Your age', 'Your address'], correctIndex: 0 },
      { id: 'personal-3', question: 'What does "marital status" ask about?', options: ['Whether you are married or single', 'Your nationality', 'Your job'], correctIndex: 0 },
    ],
  },
  {
    key: 'opening_bank_account',
    icon: 'credit-card',
    title: 'Opening a Bank Account',
    vocabulary: [
      { word: "I'd like to open an account", meaning: 'Requesting a new bank account', example: "I'd like to open a bank account, please." },
      { word: 'proof of address', meaning: 'A document showing where you live', example: 'You will need proof of address.' },
      { word: 'identification / ID', meaning: 'A document proving who you are', example: 'Please show your ID.' },
      { word: 'sort code / account number', meaning: 'UK bank account details', example: 'What is your sort code?' },
    
      { word: 'online banking', meaning: 'Managing your account over the internet', example: 'I use online banking often.' },
      { word: 'joint account', meaning: 'A bank account shared by two people', example: 'We opened a joint account.' },
      { word: 'minimum deposit', meaning: 'The smallest amount needed to open an account', example: "What's the minimum deposit?" },
    ],
    pronunciationTip: '"Identification" is a long word — break it into parts: "eye-DEN-ti-fi-KAY-shun".',
    conversation: [
      { speaker: 'You', line: "I'd like to open a bank account, please." },
      { speaker: 'Bank staff', line: 'Sure, do you have proof of address and ID?' },
      { speaker: 'You', line: 'Yes, here they are.' },
    ],
    quiz: [
      { id: 'bankaccount-1', question: 'What document shows where you live?', options: ['Proof of address', 'Ticket', 'Menu'], correctIndex: 0 },
      { id: 'bankaccount-2', question: 'What proves who you are?', options: ['ID', 'A recipe', 'A bill'], correctIndex: 0 },
      { id: 'bankaccount-3', question: 'How do you request a new account?', options: ["I'd like to open an account", 'Give me account', 'Account now'], correctIndex: 0 },
    ],
  },
  {
    key: 'job_interview',
    icon: 'briefcase',
    title: 'Job Interviews',
    vocabulary: [
      { word: 'Tell me about yourself', meaning: 'A common interview question', example: 'Tell me about yourself.' },
      { word: 'strengths / weaknesses', meaning: 'Your good and bad points', example: 'My strength is communication.' },
      { word: 'available to start', meaning: 'When you can begin work', example: 'I am available to start next week.' },
      { word: 'Do you have any questions?', meaning: 'What interviewers often ask at the end', example: 'Do you have any questions for us?' },
    
      { word: 'previous experience', meaning: 'Past work you have done', example: 'Tell me about your previous experience.' },
      { word: 'salary expectations', meaning: 'How much pay you expect', example: 'What are your salary expectations?' },
      { word: 'thank you for the opportunity', meaning: 'A polite closing at an interview', example: 'Thank you for the opportunity.' },
    ],
    pronunciationTip: '"Strengths" is a difficult consonant cluster — practise saying "strengkths" slowly at first.',
    conversation: [
      { speaker: 'Interviewer', line: 'Tell me about yourself.' },
      { speaker: 'You', line: 'I have three years of experience in retail, and I enjoy working with people.' },
      { speaker: 'Interviewer', line: 'When are you available to start?' },
      { speaker: 'You', line: 'I can start next Monday.' },
    ],
    quiz: [
      { id: 'interview-1', question: 'What does "available to start" mean?', options: ['When you can begin work', 'Your salary', 'Your address'], correctIndex: 0 },
      { id: 'interview-2', question: 'What might an interviewer ask about your character?', options: ['Strengths and weaknesses', 'Your postcode', 'Your bank details'], correctIndex: 0 },
      { id: 'interview-3', question: 'What do interviewers often ask at the end?', options: ['Do you have any questions?', 'Goodbye now', 'What is your address?'], correctIndex: 0 },
    ],
  },
  {
    key: 'cv_work_experience',
    icon: 'award',
    title: 'CV and Work Experience',
    vocabulary: [
      { word: 'CV / resume', meaning: 'A document listing your work history', example: "I'll send you my CV." },
      { word: 'previous job', meaning: 'A job you had before', example: 'My previous job was in a shop.' },
      { word: 'skills', meaning: 'Things you are good at', example: 'My skills include customer service.' },
      { word: 'reference', meaning: 'Someone who can speak about your work', example: 'Can you give me a reference?' },
    
      { word: 'qualifications', meaning: 'Certificates or degrees you have', example: 'What are your qualifications?' },
      { word: 'cover letter', meaning: 'A letter explaining your application', example: 'I attached a cover letter.' },
      { word: 'apply for a job', meaning: 'To formally request a job', example: "I'm applying for a job in retail." },
    ],
    pronunciationTip: '"CV" is said as two letters: "see-vee".',
    conversation: [
      { speaker: 'A', line: 'What was your previous job?' },
      { speaker: 'B', line: 'I worked as a cleaner. I can also give you a reference.' },
    ],
    quiz: [
      { id: 'cv-1', question: 'What lists your work history?', options: ['CV', 'Bill', 'Menu'], correctIndex: 0 },
      { id: 'cv-2', question: 'What does "skills" mean?', options: ['Things you are good at', 'Your address', 'Your age'], correctIndex: 0 },
      { id: 'cv-3', question: 'Who can speak about your past work?', options: ['A reference', 'A landlord', 'A neighbour'], correctIndex: 0 },
    ],
  },
  {
    key: 'workplace_communication',
    icon: 'message-circle',
    title: 'Workplace Communication',
    vocabulary: [
      { word: "Could you explain that again?", meaning: 'Asking for clarification at work', example: 'Sorry, could you explain that again?' },
      { word: "I'll get it done by...", meaning: 'Giving a deadline', example: "I'll get it done by Friday." },
      { word: 'Let me know if you need anything', meaning: 'Offering help', example: 'Let me know if you need anything.' },
      { word: "I'm running a bit late", meaning: 'Warning you will be delayed', example: "Sorry, I'm running a bit late." },
    
      { word: 'send an email', meaning: 'To communicate in writing at work', example: "I'll send you an email." },
      { word: 'a quick question', meaning: 'A short, simple question', example: 'Can I ask a quick question?' },
      { word: 'update you', meaning: 'To give someone new information', example: "I'll update you tomorrow." },
    ],
    pronunciationTip: 'Keep workplace English polite and simple — short, clear sentences work better than long ones.',
    conversation: [
      { speaker: 'A', line: 'Could you explain that again, please?' },
      { speaker: 'B', line: 'Of course. Let me know if you need anything else.' },
    ],
    quiz: [
      { id: 'workcomm-1', question: 'How do you politely ask for clarification?', options: ['Could you explain that again?', 'What?', 'I do not care'], correctIndex: 0 },
      { id: 'workcomm-2', question: 'How do you give a deadline?', options: ["I'll get it done by...", 'Never', 'Maybe someday'], correctIndex: 0 },
      { id: 'workcomm-3', question: 'How do you warn you will be late?', options: ["I'm running a bit late", 'I am never coming', 'I am early'], correctIndex: 0 },
    ],
  },
  {
    key: 'asking_day_off',
    icon: 'calendar',
    title: 'Asking for a Day Off',
    vocabulary: [
      { word: "Could I take a day off?", meaning: 'Asking for leave', example: 'Could I take a day off next week?' },
      { word: 'annual leave / holiday', meaning: 'Paid time away from work', example: 'I have five days of annual leave left.' },
      { word: 'sick leave', meaning: 'Leave for being unwell', example: "I need to take sick leave today." },
      { word: 'approved', meaning: 'Officially agreed to', example: 'My leave request was approved.' },
    
      { word: 'personal reasons', meaning: 'A private reason for leave', example: 'I need the day off for personal reasons.' },
      { word: 'in advance', meaning: 'Before something happens', example: 'Please ask for leave in advance.' },
      { word: 'unpaid leave', meaning: 'Time off without pay', example: 'I took two days of unpaid leave.' },
    ],
    pronunciationTip: '"Leave" and "live" sound different — "leave" has a longer "ee" sound.',
    conversation: [
      { speaker: 'You', line: 'Could I take a day off next Friday?' },
      { speaker: 'Manager', line: "Sure, I'll approve it." },
    ],
    quiz: [
      { id: 'dayoff-1', question: 'How do you ask for leave?', options: ['Could I take a day off?', 'Give me day off', 'I am not coming'], correctIndex: 0 },
      { id: 'dayoff-2', question: 'What is leave for being unwell called?', options: ['Sick leave', 'Annual leave', 'Bank holiday'], correctIndex: 0 },
      { id: 'dayoff-3', question: 'What does "approved" mean?', options: ['Officially agreed to', 'Refused', 'Forgotten'], correctIndex: 0 },
    ],
  },
  {
    key: 'colleagues',
    icon: 'users',
    title: 'Colleagues',
    vocabulary: [
      { word: 'colleague', meaning: 'Someone you work with', example: 'She is my colleague.' },
      { word: 'manager / boss', meaning: 'A person who leads a team', example: 'My manager is very supportive.' },
      { word: 'team', meaning: 'A group who work together', example: 'I work well with my team.' },
      { word: 'work together', meaning: 'Collaborating on a task', example: 'We work together on projects.' },
    
      { word: 'work well together', meaning: 'Collaborating effectively', example: 'We work well together.' },
      { word: 'friendly team', meaning: 'A pleasant group of colleagues', example: "It's a friendly team." },
      { word: 'introduce myself', meaning: 'To tell new colleagues who you are', example: 'Let me introduce myself.' },
    ],
    pronunciationTip: '"Colleague" is stressed on the first part: "COL-eeg".',
    conversation: [
      { speaker: 'A', line: 'How do you get on with your colleagues?' },
      { speaker: 'B', line: 'Very well, we work together as a good team.' },
    ],
    quiz: [
      { id: 'colleagues-1', question: 'What is someone you work with called?', options: ['Colleague', 'Neighbour', 'Tenant'], correctIndex: 0 },
      { id: 'colleagues-2', question: 'Who leads a team at work?', options: ['Manager', 'Landlord', 'Guest'], correctIndex: 0 },
      { id: 'colleagues-3', question: 'What does "work together" mean?', options: ['Collaborate on a task', 'Work alone', 'Never work'], correctIndex: 0 },
    ],
  },
  {
    key: 'meetings',
    icon: 'message-square',
    title: 'Meetings',
    vocabulary: [
      { word: 'meeting', meaning: 'A gathering to discuss something', example: 'We have a meeting at 10am.' },
      { word: "Let's get started", meaning: 'Beginning a meeting', example: "OK, let's get started." },
      { word: 'agenda', meaning: 'A list of topics to discuss', example: "What's on the agenda today?" },
      { word: 'any other business?', meaning: 'Asking if there is more to discuss', example: 'Any other business before we finish?' },
    
      { word: 'take minutes', meaning: 'To write notes during a meeting', example: 'Can you take minutes today?' },
      { word: 'postpone the meeting', meaning: 'To delay a meeting', example: 'We need to postpone the meeting.' },
      { word: 'follow up', meaning: 'To check progress after a meeting', example: "I'll follow up by email." },
    ],
    pronunciationTip: '"Agenda" is stressed on the second part: "a-JEN-da".',
    conversation: [
      { speaker: 'Manager', line: "OK everyone, let's get started. What's on the agenda?" },
      { speaker: 'You', line: 'We need to discuss the new schedule.' },
    ],
    quiz: [
      { id: 'meetings-1', question: 'What is a list of topics to discuss called?', options: ['Agenda', 'Bill', 'Menu'], correctIndex: 0 },
      { id: 'meetings-2', question: 'How do you begin a meeting?', options: ["Let's get started", 'Goodbye', 'See you'], correctIndex: 0 },
      { id: 'meetings-3', question: 'What is a gathering to discuss something called?', options: ['A meeting', 'A holiday', 'A wedding'], correctIndex: 0 },
    ],
  },
  {
    key: 'parents_evening',
    icon: 'users',
    title: 'Parents\' Evening',
    vocabulary: [
      { word: "parents' evening", meaning: 'A school meeting for parents', example: "Parents' evening is next Tuesday." },
      { word: 'progress report', meaning: 'A report on a student\'s progress', example: 'The teacher gave a progress report.' },
      { word: 'How is my child doing?', meaning: 'A question parents ask teachers', example: 'How is my child doing in class?' },
      { word: 'behaviour', meaning: 'How a child acts', example: "Her behaviour has been excellent." },
    
      { word: 'academic progress', meaning: "A student's learning achievements", example: 'His academic progress is good.' },
      { word: 'strengths and weaknesses', meaning: "A student's good and weak areas", example: "Let's talk about his strengths and weaknesses." },
      { word: 'book a slot', meaning: 'To reserve a meeting time', example: "I'd like to book a slot." },
    ],
    pronunciationTip: '"Behaviour" is stressed on the second part: "be-HAY-vyer".',
    conversation: [
      { speaker: 'You', line: 'How is my son doing in class?' },
      { speaker: 'Teacher', line: 'He is doing very well, and his behaviour is excellent.' },
    ],
    quiz: [
      { id: 'parentsevening-1', question: 'What is a school meeting for parents called?', options: ["Parents' evening", 'A wedding', 'A council meeting'], correctIndex: 0 },
      { id: 'parentsevening-2', question: 'What does "behaviour" mean?', options: ['How a child acts', 'A child\'s age', 'A child\'s name'], correctIndex: 0 },
      { id: 'parentsevening-3', question: 'How do you ask about your child\'s progress?', options: ['How is my child doing?', 'Where is my child?', 'What is my child?'], correctIndex: 0 },
    ],
  },
  {
    key: 'childrens_school_day',
    icon: 'book-open',
    title: "Children's School Day",
    vocabulary: [
      { word: 'school run', meaning: 'Taking children to and from school', example: 'I do the school run every morning.' },
      { word: 'lunchbox', meaning: 'A box for a child\'s lunch', example: "I packed her lunchbox." },
      { word: 'school uniform', meaning: 'Clothes worn for school', example: 'He wears a school uniform.' },
      { word: 'pick up / drop off', meaning: 'Taking a child to/from a place', example: 'I pick him up at 3pm.' },
    
      { word: 'after-school club', meaning: 'An activity after lessons end', example: 'He goes to an after-school club.' },
      { word: 'break time / playtime', meaning: 'A rest period at school', example: 'They play outside at break time.' },
      { word: 'school bag', meaning: 'A bag for carrying school items', example: "Don't forget your school bag." },
    ],
    pronunciationTip: '"Uniform" is stressed on the first part: "YOO-ni-form".',
    conversation: [
      { speaker: 'A', line: 'Who does the school run in your family?' },
      { speaker: 'B', line: 'I drop the kids off, and my husband picks them up.' },
    ],
    quiz: [
      { id: 'schoolday-1', question: 'What is taking children to school called?', options: ['School run', 'School trip', 'School bus'], correctIndex: 0 },
      { id: 'schoolday-2', question: 'What holds a child\'s lunch?', options: ['Lunchbox', 'Wardrobe', 'Trolley'], correctIndex: 0 },
      { id: 'schoolday-3', question: 'What do children often wear to school in the UK?', options: ['School uniform', 'Pyjamas', 'A coat only'], correctIndex: 0 },
    ],
  },
  {
    key: 'homework',
    icon: 'edit-3',
    title: 'Homework',
    vocabulary: [
      { word: 'homework', meaning: 'School work done at home', example: 'She is doing her homework.' },
      { word: 'due tomorrow', meaning: 'Needs to be finished by tomorrow', example: 'This homework is due tomorrow.' },
      { word: 'help with homework', meaning: 'Assisting a child with school work', example: 'I help my son with his homework.' },
      { word: 'finish / hand in', meaning: 'Complete and submit work', example: 'Did you hand in your homework?' },
    
      { word: 'worksheet', meaning: 'A page of exercises to complete', example: 'Please complete this worksheet.' },
      { word: 'reading log', meaning: 'A record of books read', example: 'Fill in your reading log.' },
      { word: 'revise for a test', meaning: 'To study before an exam', example: "I'm revising for a test." },
    ],
    pronunciationTip: '"Homework" is stressed on the first part: "HOME-work".',
    conversation: [
      { speaker: 'A', line: 'Have you finished your homework?' },
      { speaker: 'B', line: 'Not yet, it\'s due tomorrow.' },
    ],
    quiz: [
      { id: 'homework-1', question: 'What is school work done at home called?', options: ['Homework', 'Housework', 'Fieldwork'], correctIndex: 0 },
      { id: 'homework-2', question: 'What does "due tomorrow" mean?', options: ['Must be finished by tomorrow', 'Already finished', 'Not needed'], correctIndex: 0 },
      { id: 'homework-3', question: 'What do you do with finished homework?', options: ['Hand it in', 'Throw it away', 'Hide it'], correctIndex: 0 },
    ],
  },
  {
    key: 'teachers',
    icon: 'book-open',
    title: 'Talking to Teachers',
    vocabulary: [
      { word: "Could I speak to the teacher?", meaning: 'Asking to talk with a teacher', example: 'Could I speak to the teacher, please?' },
      { word: 'class teacher', meaning: "A child's main teacher", example: "Who is his class teacher?" },
      { word: 'send a message / note', meaning: 'Communicating with school', example: "I'll send a note to the teacher." },
      { word: 'thank you for your time', meaning: 'A polite closing phrase', example: 'Thank you for your time today.' },
    
      { word: 'head teacher', meaning: 'The teacher in charge of a school', example: 'I spoke to the head teacher.' },
      { word: "parents' contact number", meaning: 'A phone number for the school to reach parents', example: 'Please update your contact number.' },
      { word: 'concerned about', meaning: 'Worried about something', example: "I'm concerned about his reading." },
    ],
    pronunciationTip: 'Say "class teacher" with equal stress on both words, unlike some compound nouns.',
    conversation: [
      { speaker: 'You', line: 'Could I speak to the class teacher, please?' },
      { speaker: 'Receptionist', line: 'Of course, I\'ll get her for you.' },
    ],
    quiz: [
      { id: 'teachers-1', question: 'How do you ask to speak to a teacher?', options: ['Could I speak to the teacher?', 'Teacher now', 'Give me teacher'], correctIndex: 0 },
      { id: 'teachers-2', question: 'What is a child\'s main teacher called?', options: ['Class teacher', 'Head teacher only', 'Manager'], correctIndex: 0 },
      { id: 'teachers-3', question: 'What is a polite way to end a conversation?', options: ['Thank you for your time', 'Goodbye forever', 'I am busy'], correctIndex: 0 },
    ],
  },
  {
    key: 'gp_registration',
    icon: 'user-plus',
    title: 'Registering with a GP',
    vocabulary: [
      { word: 'GP / doctor\'s surgery', meaning: 'Your local family doctor / clinic', example: "I'd like to register with a GP." },
      { word: 'register', meaning: 'To officially join as a patient', example: 'I need to register at the surgery.' },
      { word: 'medical history', meaning: 'Your past health information', example: 'They asked about my medical history.' },
      { word: 'NHS number', meaning: 'A unique UK health service number', example: 'What is your NHS number?' },
    
      { word: 'new patient form', meaning: 'A form for registering as a patient', example: 'Please complete the new patient form.' },
      { word: 'catchment area', meaning: 'The local area a surgery covers', example: 'Are you in our catchment area?' },
      { word: 'health check', meaning: 'A routine medical review', example: "I'd like to book a health check." },
    ],
    pronunciationTip: '"GP" is said as two letters: "gee-pee".',
    conversation: [
      { speaker: 'You', line: "I'd like to register with this GP surgery." },
      { speaker: 'Receptionist', line: 'Sure, do you have your ID and proof of address?' },
    ],
    quiz: [
      { id: 'gp-1', question: 'What does GP stand for in the UK?', options: ['General Practitioner', 'General Police', 'Good Practice'], correctIndex: 0 },
      { id: 'gp-2', question: 'What does "register" mean here?', options: ['Officially join as a patient', 'Leave the doctor', 'Pay a bill'], correctIndex: 0 },
      { id: 'gp-3', question: 'What is a unique UK health number called?', options: ['NHS number', 'Postcode', 'Sort code'], correctIndex: 0 },
    ],
  },
  {
    key: 'nhs_general',
    icon: 'heart',
    title: 'Using the NHS',
    vocabulary: [
      { word: 'NHS', meaning: "The UK's National Health Service", example: 'The NHS is free at the point of use.' },
      { word: '111 / 999', meaning: 'Non-emergency and emergency numbers', example: 'Call 111 for non-emergency advice.' },
      { word: 'referral', meaning: 'Being sent to see a specialist', example: 'My doctor gave me a referral.' },
      { word: 'waiting list', meaning: 'A queue for treatment', example: "I'm on the waiting list for an appointment." },
    
      { word: 'A&E vs GP', meaning: 'Knowing which service to use', example: 'For emergencies, go to A&E, not the GP.' },
      { word: 'free prescriptions', meaning: 'Medicine provided at no cost in some cases', example: 'Children get free prescriptions.' },
      { word: 'vaccination', meaning: 'An injection to prevent illness', example: "I've had my flu vaccination." },
    ],
    pronunciationTip: '"NHS" is said as three separate letters: "en-aitch-ess".',
    conversation: [
      { speaker: 'A', line: 'Are you feeling unwell? You should call 111.' },
      { speaker: 'B', line: 'Yes, I will. My doctor may give me a referral too.' },
    ],
    quiz: [
      { id: 'nhs-1', question: 'What does NHS stand for?', options: ['National Health Service', 'National Housing Service', 'New Health Scheme'], correctIndex: 0 },
      { id: 'nhs-2', question: 'What number is for non-emergency medical advice?', options: ['111', '999', '101'], correctIndex: 0 },
      { id: 'nhs-3', question: 'What is being sent to see a specialist called?', options: ['A referral', 'A refund', 'A reference'], correctIndex: 0 },
    ],
  },
  {
    key: 'prescriptions',
    icon: 'clipboard',
    title: 'Prescriptions',
    vocabulary: [
      { word: 'prescription', meaning: 'A doctor\'s order for medicine', example: 'I need to collect my prescription.' },
      { word: 'repeat prescription', meaning: 'A prescription you get regularly', example: "I've ordered a repeat prescription." },
      { word: 'dosage', meaning: 'How much medicine to take', example: "What is the correct dosage?" },
      { word: 'side effects', meaning: 'Unwanted effects of medicine', example: 'Does it have any side effects?' },
    
      { word: 'over-the-counter medicine', meaning: 'Medicine bought without a prescription', example: 'This is over-the-counter medicine.' },
      { word: 'prescription charge', meaning: 'The fee for a prescription in England', example: "What's the prescription charge?" },
      { word: 'follow the instructions', meaning: 'To use medicine correctly', example: 'Please follow the instructions carefully.' },
    ],
    pronunciationTip: '"Prescription" is stressed on the second part: "pre-SCRIP-shun".',
    conversation: [
      { speaker: 'You', line: "I'd like to collect my prescription, please." },
      { speaker: 'Pharmacist', line: 'Sure, what is your date of birth?' },
    ],
    quiz: [
      { id: 'prescription-1', question: 'What is a doctor\'s order for medicine called?', options: ['Prescription', 'Referral', 'Receipt'], correctIndex: 0 },
      { id: 'prescription-2', question: 'What describes how much medicine to take?', options: ['Dosage', 'Address', 'Balance'], correctIndex: 0 },
      { id: 'prescription-3', question: 'What are unwanted effects of medicine called?', options: ['Side effects', 'Good effects', 'No effects'], correctIndex: 0 },
    ],
  },
  {
    key: 'buying_tickets',
    icon: 'bookmark',
    title: 'Buying Tickets',
    vocabulary: [
      { word: 'ticket machine', meaning: 'A machine that sells tickets', example: 'Use the ticket machine on platform 1.' },
      { word: 'day ticket / weekly pass', meaning: 'Types of travel tickets', example: "I'd like a day ticket, please." },
      { word: 'top up', meaning: 'Add credit to a travel card', example: 'I need to top up my card.' },
      { word: 'valid ticket', meaning: 'A ticket that can be used', example: 'You need a valid ticket to travel.' },
    
      { word: 'concession / student ticket', meaning: 'A discounted ticket type', example: 'Do you have a student ticket?' },
      { word: 'contactless payment', meaning: 'Paying by tapping a card', example: 'You can use contactless payment.' },
      { word: 'peak / off-peak', meaning: 'Busy and quiet travel times', example: 'Off-peak tickets are cheaper.' },
    ],
    pronunciationTip: '"Valid" is stressed on the first part: "VAL-id".',
    conversation: [
      { speaker: 'You', line: "I'd like a day ticket, please." },
      { speaker: 'Staff', line: "That's £5.60. Do you need to top up your card too?" },
    ],
    quiz: [
      { id: 'buyingtickets-1', question: 'What sells tickets automatically?', options: ['Ticket machine', 'Fridge', 'Wardrobe'], correctIndex: 0 },
      { id: 'buyingtickets-2', question: 'What does "top up" mean?', options: ['Add credit to a card', 'Remove credit', 'Cancel a ticket'], correctIndex: 0 },
      { id: 'buyingtickets-3', question: 'What is a ticket you can use called?', options: ['Valid', 'Invalid', 'Expensive'], correctIndex: 0 },
    ],
  },
  {
    key: 'taxi',
    icon: 'navigation',
    title: 'Taking a Taxi',
    vocabulary: [
      { word: "Can you take me to...?", meaning: 'Telling a taxi driver your destination', example: 'Can you take me to the station, please?' },
      { word: 'fare', meaning: 'The cost of a taxi ride', example: "What's the fare to the airport?" },
      { word: 'How long will it take?', meaning: 'Asking about journey time', example: 'How long will it take to get there?' },
      { word: 'Keep the change', meaning: 'Telling the driver to keep extra money', example: 'Keep the change, thank you.' },
    
      { word: 'book a taxi', meaning: 'To arrange a taxi in advance', example: "I'd like to book a taxi for 9am." },
      { word: 'meter', meaning: 'A device showing the taxi fare', example: 'Please use the meter.' },
      { word: 'drop me off here', meaning: 'Asking the driver to stop', example: 'Please drop me off here.' },
    ],
    pronunciationTip: '"Fare" and "fair" sound the same — context makes the meaning clear.',
    conversation: [
      { speaker: 'You', line: 'Can you take me to the train station, please?' },
      { speaker: 'Driver', line: 'Of course, hop in.' },
      { speaker: 'You', line: 'How long will it take?' },
      { speaker: 'Driver', line: 'About ten minutes.' },
    ],
    quiz: [
      { id: 'taxi-1', question: 'What is the cost of a taxi ride called?', options: ['Fare', 'Bill', 'Balance'], correctIndex: 0 },
      { id: 'taxi-2', question: 'How do you tell a driver your destination?', options: ['Can you take me to...?', 'Go there now', 'Where are we?'], correctIndex: 0 },
      { id: 'taxi-3', question: 'What do you say when you let the driver keep extra money?', options: ['Keep the change', 'Give it back', 'No thanks'], correctIndex: 0 },
    ],
  },
  {
    key: 'driving_car',
    icon: 'truck',
    title: 'Driving and Cars',
    vocabulary: [
      { word: 'driving licence', meaning: 'A document allowing you to drive', example: 'Do you have a UK driving licence?' },
      { word: 'petrol / fuel', meaning: 'What powers most cars', example: 'I need to buy petrol.' },
      { word: 'parking space', meaning: 'A place to park a car', example: "There's a parking space over there." },
      { word: 'MOT', meaning: 'An annual UK car safety test', example: 'My car needs an MOT.' },
    
      { word: 'insurance', meaning: 'Protection in case of accidents', example: 'My car insurance is due for renewal.' },
      { word: 'seatbelt', meaning: 'A safety strap in a car', example: 'Please wear your seatbelt.' },
      { word: 'breakdown', meaning: 'When a vehicle stops working', example: 'My car had a breakdown on the motorway.' },
    ],
    pronunciationTip: '"MOT" is said as three letters: "em-oh-tee".',
    conversation: [
      { speaker: 'A', line: 'Do you drive to work?' },
      { speaker: 'B', line: 'Yes, but my car needs an MOT this month.' },
    ],
    quiz: [
      { id: 'driving-1', question: 'What allows you to legally drive?', options: ['Driving licence', 'Library card', 'ID card'], correctIndex: 0 },
      { id: 'driving-2', question: 'What powers most cars?', options: ['Petrol', 'Water', 'Electricity only'], correctIndex: 0 },
      { id: 'driving-3', question: 'What is the annual UK car safety test called?', options: ['MOT', 'GP', 'NHS'], correctIndex: 0 },
    ],
  },
  {
    key: 'traffic',
    icon: 'alert-triangle',
    title: 'Traffic',
    vocabulary: [
      { word: 'traffic jam', meaning: 'Many vehicles stuck together', example: "There's a traffic jam on the motorway." },
      { word: 'traffic lights', meaning: 'Lights controlling traffic', example: 'Stop at the traffic lights.' },
      { word: 'rush hour', meaning: 'The busiest travel times', example: 'Traffic is bad during rush hour.' },
      { word: 'delayed', meaning: 'Later than expected', example: 'My bus is delayed.' },
    
      { word: 'roadworks', meaning: 'Construction work on a road', example: 'There are roadworks ahead.' },
      { word: 'diversion', meaning: 'An alternative route', example: 'Follow the diversion signs.' },
      { word: 'heavy traffic', meaning: 'A large amount of slow-moving traffic', example: "There's heavy traffic on the A40." },
    ],
    pronunciationTip: '"Traffic" is stressed on the first part: "TRAF-ik".',
    conversation: [
      { speaker: 'A', line: 'Why are you late?' },
      { speaker: 'B', line: 'Sorry, there was a huge traffic jam during rush hour.' },
    ],
    quiz: [
      { id: 'traffic-1', question: 'What is many vehicles stuck together called?', options: ['Traffic jam', 'Traffic light', 'Rush hour'], correctIndex: 0 },
      { id: 'traffic-2', question: 'When is traffic usually worst?', options: ['Rush hour', 'Midnight', 'Early morning weekend'], correctIndex: 0 },
      { id: 'traffic-3', question: 'What does "delayed" mean?', options: ['Later than expected', 'On time', 'Early'], correctIndex: 0 },
    ],
  },
  {
    key: 'road_signs',
    icon: 'octagon',
    title: 'Road Signs',
    vocabulary: [
      { word: 'stop sign', meaning: 'A sign telling drivers to stop', example: 'Stop at the stop sign.' },
      { word: 'speed limit', meaning: 'The maximum allowed speed', example: 'The speed limit is 30 miles per hour.' },
      { word: 'one way', meaning: 'Traffic can only go one direction', example: "It's a one way street." },
      { word: 'no parking', meaning: 'Parking is not allowed', example: "You can't park here, it's a no parking zone." },
    
      { word: 'give way', meaning: 'Let other traffic go first', example: 'Give way to traffic on the right.' },
      { word: 'pedestrian crossing', meaning: 'A place for people to cross safely', example: 'Use the pedestrian crossing.' },
      { word: 'no entry', meaning: 'Vehicles are not allowed to enter', example: 'That road is no entry.' },
    ],
    pronunciationTip: '"Speed limit" is stressed on both parts equally, each word clear: "SPEED LIM-it".',
    conversation: [
      { speaker: 'A', line: "What's the speed limit here?" },
      { speaker: 'B', line: "It's 30 miles per hour, and remember it's a one way street." },
    ],
    quiz: [
      { id: 'roadsigns-1', question: 'What tells you the maximum speed?', options: ['Speed limit', 'Stop sign', 'No parking'], correctIndex: 0 },
      { id: 'roadsigns-2', question: 'What does "one way" mean?', options: ['Traffic goes one direction only', 'Traffic goes both ways', 'No traffic allowed'], correctIndex: 0 },
      { id: 'roadsigns-3', question: 'What sign means you cannot leave your car there?', options: ['No parking', 'One way', 'Stop'], correctIndex: 0 },
    ],
  },
  {
    key: 'police_reporting',
    icon: 'shield',
    title: 'Talking to the Police',
    vocabulary: [
      { word: "I'd like to report...", meaning: 'Starting a police report', example: "I'd like to report a theft." },
      { word: 'witness', meaning: 'Someone who saw an event', example: 'I am a witness to the accident.' },
      { word: 'incident', meaning: 'An event, often unwanted', example: 'The incident happened yesterday.' },
      { word: 'crime reference number', meaning: 'A number given after reporting a crime', example: 'What is my crime reference number?' },
    
      { word: 'statement', meaning: 'A written account of an event', example: 'I gave a statement to the police.' },
      { word: 'stolen', meaning: 'Taken without permission', example: 'My bike was stolen.' },
      { word: 'CCTV footage', meaning: 'Recorded camera video', example: 'They checked the CCTV footage.' },
    ],
    pronunciationTip: '"Witness" is stressed on the first part: "WIT-ness".',
    conversation: [
      { speaker: 'You', line: "I'd like to report a theft, please." },
      { speaker: 'Police officer', line: 'Can you describe what happened?' },
      { speaker: 'You', line: 'My bag was taken outside the shop.' },
    ],
    quiz: [
      { id: 'police-1', question: 'What is someone who saw an event called?', options: ['Witness', 'Landlord', 'Colleague'], correctIndex: 0 },
      { id: 'police-2', question: 'How do you start a police report?', options: ["I'd like to report...", 'Help me now!', 'Police, come here'], correctIndex: 0 },
      { id: 'police-3', question: 'What number do you get after reporting a crime?', options: ['Crime reference number', 'Postcode', 'Sort code'], correctIndex: 0 },
    ],
  },
  {
    key: 'lost_property',
    icon: 'search',
    title: 'Lost Property',
    vocabulary: [
      { word: "I've lost my...", meaning: 'Reporting something lost', example: "I've lost my wallet." },
      { word: 'lost property office', meaning: 'Where lost items are kept', example: 'Try the lost property office.' },
      { word: 'Have you found...?', meaning: 'Asking if something has been found', example: 'Have you found a black bag?' },
      { word: 'describe it', meaning: 'Give details about an item', example: 'Can you describe it, please?' },
    
      { word: 'left behind', meaning: 'Accidentally not taken with you', example: 'I think I left it behind on the train.' },
      { word: 'reward', meaning: 'Money offered for returning something', example: "I'll offer a reward." },
      { word: 'identify it', meaning: 'To confirm an item is yours', example: 'Can you identify it?' },
    ],
    pronunciationTip: '"Lost" has a short "o" sound like in "cost", not a long one.',
    conversation: [
      { speaker: 'You', line: "I've lost my phone. Have you found it?" },
      { speaker: 'Staff', line: 'Can you describe it, please?' },
      { speaker: 'You', line: "It's a black phone with a blue case." },
    ],
    quiz: [
      { id: 'lostproperty-1', question: 'Where do you go to find something you lost?', options: ['Lost property office', 'Post office', 'Bank'], correctIndex: 0 },
      { id: 'lostproperty-2', question: 'How do you report something lost?', options: ["I've lost my...", 'Give me it', 'It is gone forever'], correctIndex: 0 },
      { id: 'lostproperty-3', question: 'What might staff ask you to do?', options: ['Describe it', 'Pay a fine', 'Sign a contract'], correctIndex: 0 },
    ],
  },
  {
    key: 'internet_wifi',
    icon: 'wifi',
    title: 'Internet and Wi-Fi',
    vocabulary: [
      { word: 'Wi-Fi password', meaning: 'The code to join a wireless network', example: "What's the Wi-Fi password?" },
      { word: 'connect to the internet', meaning: 'To go online', example: 'I need to connect to the internet.' },
      { word: 'signal', meaning: 'The strength of a wireless connection', example: 'The signal here is weak.' },
      { word: "It's not working", meaning: 'Reporting a technical problem', example: "The Wi-Fi isn't working." },
    
      { word: 'router', meaning: 'A device providing Wi-Fi', example: 'The router is in the living room.' },
      { word: 'download / upload', meaning: 'Sending and receiving data online', example: 'The file is downloading now.' },
      { word: 'reset the connection', meaning: 'Restarting the internet connection', example: "Let's reset the connection." },
    ],
    pronunciationTip: '"Wi-Fi" is pronounced "WY-fy", stressing both parts equally.',
    conversation: [
      { speaker: 'You', line: "Excuse me, what's the Wi-Fi password?" },
      { speaker: 'Staff', line: "It's on the receipt — all lowercase." },
    ],
    quiz: [
      { id: 'wifi-1', question: 'What do you need to join a wireless network?', options: ['Wi-Fi password', 'A stamp', 'A ticket'], correctIndex: 0 },
      { id: 'wifi-2', question: 'What describes connection strength?', options: ['Signal', 'Balance', 'Fare'], correctIndex: 0 },
      { id: 'wifi-3', question: 'How do you report a technical problem?', options: ["It's not working", 'It is perfect', 'I like it'], correctIndex: 0 },
    ],
  },
  {
    key: 'mobile_sim',
    icon: 'smartphone',
    title: 'Mobile Phones and SIM Cards',
    vocabulary: [
      { word: 'SIM card', meaning: 'A card that connects your phone to a network', example: 'I need a new SIM card.' },
      { word: 'top up my phone', meaning: 'Adding credit to a mobile phone', example: "I'd like to top up my phone." },
      { word: 'contract / pay as you go', meaning: 'Ways to pay for a phone plan', example: "I'm on a pay as you go plan." },
      { word: 'no signal / low battery', meaning: 'Common phone problems', example: 'I have no signal here.' },
    
      { word: 'data plan', meaning: 'A mobile internet package', example: 'I have a large data plan.' },
      { word: 'roaming', meaning: 'Using your phone abroad', example: 'Roaming charges can be expensive.' },
      { word: 'unlock the phone', meaning: 'Removing network restrictions', example: 'Can you unlock my phone?' },
    ],
    pronunciationTip: '"SIM" is said like the word "sim" in "simple", not spelled out as letters.',
    conversation: [
      { speaker: 'You', line: "I'd like to buy a SIM card, please." },
      { speaker: 'Staff', line: 'Would you like a contract or pay as you go?' },
      { speaker: 'You', line: 'Pay as you go, please.' },
    ],
    quiz: [
      { id: 'mobile-1', question: 'What connects a phone to a network?', options: ['SIM card', 'Library card', 'Debit card'], correctIndex: 0 },
      { id: 'mobile-2', question: 'What does "top up" mean for a phone?', options: ['Add credit', 'Delete numbers', 'Turn it off'], correctIndex: 0 },
      { id: 'mobile-3', question: 'Which is a way to pay for a phone plan?', options: ['Pay as you go', 'Top down', 'Free forever'], correctIndex: 0 },
    ],
  },
  {
    key: 'uk_culture_basics',
    icon: 'globe',
    title: 'About the UK',
    vocabulary: [
      { word: 'England, Scotland, Wales, Northern Ireland', meaning: 'The four nations of the UK', example: 'The UK has four nations.' },
      { word: 'queue', meaning: 'A line of people waiting', example: 'Please join the queue.' },
      { word: 'polite / please and thank you', meaning: 'Common UK social manners', example: 'Saying please and thank you is important.' },
      { word: 'small talk', meaning: 'Light, friendly conversation, often about weather', example: 'People often make small talk about the weather.' },
    
      { word: 'tea time', meaning: 'A traditional time for tea, often in the afternoon', example: 'Shall we have tea time?' },
      { word: 'apologise often', meaning: 'A common British social habit', example: 'British people often say sorry.' },
      { word: 'weather talk', meaning: 'Common small talk topic in the UK', example: 'People often start with weather talk.' },
    ],
    pronunciationTip: '"Queue" is pronounced just like the letter "Q" — "kyoo".',
    conversation: [
      { speaker: 'A', line: 'Is it normal to queue in the UK?' },
      { speaker: 'B', line: 'Yes, queuing politely is very common here.' },
    ],
    quiz: [
      { id: 'ukculture-1', question: 'What is a line of people waiting called?', options: ['Queue', 'Team', 'Class'], correctIndex: 0 },
      { id: 'ukculture-2', question: 'Which are the four nations of the UK?', options: ['England, Scotland, Wales, Northern Ireland', 'England, France, Wales, Ireland', 'London, Scotland, Wales, Paris'], correctIndex: 0 },
      { id: 'ukculture-3', question: 'What is light, friendly conversation called?', options: ['Small talk', 'Big talk', 'No talk'], correctIndex: 0 },
    ],
  },
  {
    key: 'recycling_bins',
    icon: 'refresh-cw',
    title: 'Recycling and Bins',
    vocabulary: [
      { word: 'bin / rubbish', meaning: 'Container for waste / waste itself', example: 'Put the rubbish in the bin.' },
      { word: 'recycling', meaning: 'Reusing materials like paper and plastic', example: 'We recycle paper and glass.' },
      { word: 'bin collection day', meaning: 'The day bins are emptied', example: "What's the bin collection day?" },
      { word: 'general waste', meaning: 'Waste that cannot be recycled', example: 'Food waste goes in general waste.' },
    
      { word: 'green bin / black bin', meaning: 'Common UK bin colours', example: 'Glass goes in the green bin.' },
      { word: 'compost', meaning: 'Organic waste turned into soil', example: 'We compost our food waste.' },
      { word: 'reduce, reuse, recycle', meaning: 'A common environmental phrase', example: 'Remember: reduce, reuse, recycle.' },
    ],
    pronunciationTip: '"Recycling" is stressed on the second part: "ree-SY-kling".',
    conversation: [
      { speaker: 'A', line: "What's the bin collection day this week?" },
      { speaker: 'B', line: "It's Wednesday — recycling and general waste." },
    ],
    quiz: [
      { id: 'recycling-1', question: 'What is reusing materials like paper called?', options: ['Recycling', 'General waste', 'Bin collection'], correctIndex: 0 },
      { id: 'recycling-2', question: 'What is waste that cannot be recycled called?', options: ['General waste', 'Recycling', 'Rubbish only'], correctIndex: 0 },
      { id: 'recycling-3', question: 'How do you ask when bins are emptied?', options: ["What's the bin collection day?", 'Where is the bin?', 'Is this a bin?'], correctIndex: 0 },
    ],
  },
];

// A2 — visa extension stage. Everyday situations with more complexity than
// A1: talking about the past, giving opinions, comparing options, and
// explaining problems rather than just naming things.
export const LESSONS_A2: Lesson[] = [
  {
    key: 'describing_a_past_event',
    icon: 'clock',
    title: 'Describing a Past Event',
    vocabulary: [
      { word: 'I went to...', meaning: 'Used to describe a past visit', example: 'Last month I went to a wedding.' },
      { word: 'It was...', meaning: 'Used to describe how something was', example: 'It was a really enjoyable day.' },
      { word: 'Beforehand', meaning: 'Before something happened', example: 'Beforehand, we had lunch together.' },
      { word: 'Afterwards', meaning: 'After something happened', example: 'Afterwards, we went home.' },
      { word: 'At first... but then...', meaning: 'Describes a change during an event', example: 'At first it rained, but then the sun came out.' },
      { word: 'What happened was...', meaning: 'Introduces the story of an event', example: 'What happened was, the train was delayed.' },
    ],
    pronunciationTip: 'Past tense "-ed" endings can sound like /t/, /d/, or /ɪd/ depending on the word — "walked" (/t/), "arrived" (/d/), "wanted" (/ɪd/).',
    conversation: [
      { speaker: 'A', line: 'How was the family gathering last weekend?' },
      { speaker: 'B', line: "It was lovely. At first it rained, but then the sun came out and we had a barbecue." },
    ],
    quiz: [
      { id: 'past-event-1', question: 'Which phrase describes something that happened before the main event?', options: ['Afterwards', 'Beforehand', 'Nowadays'], correctIndex: 1 },
      { id: 'past-event-2', question: '"Wanted" ends in which sound?', options: ['/t/', '/d/', '/ɪd/'], correctIndex: 2 },
      { id: 'past-event-3', question: 'Which sentence describes a change during an event?', options: ['It was a nice day', 'At first it rained, but then the sun came out', 'I went to a wedding'], correctIndex: 1 },
    ],
  },
  {
    key: 'making_a_complaint',
    icon: 'alert-circle',
    title: 'Making a Complaint',
    vocabulary: [
      { word: "I'm not happy with...", meaning: 'A polite way to start a complaint', example: "I'm not happy with the service I received." },
      { word: 'This isn\'t what I expected', meaning: 'Expresses disappointment', example: "This isn't what I expected when I booked the room." },
      { word: 'Could you look into this?', meaning: 'A polite request to investigate', example: 'Could you look into this for me, please?' },
      { word: 'I\'d like a refund / replacement', meaning: 'States what you want as a result', example: "I'd like a refund for this item." },
      { word: 'It\'s the second time this has happened', meaning: 'Shows a repeated problem', example: "It's the second time this has happened this month." },
    ],
    pronunciationTip: 'Keep complaints polite but firm — a rising, gentle tone on "Could you look into this?" sounds more cooperative than a flat, sharp tone.',
    conversation: [
      { speaker: 'A', line: "I'm not happy with the delivery — it arrived two weeks late." },
      { speaker: 'B', line: "I'm sorry to hear that. Could you give me the order number so I can look into this?" },
    ],
    quiz: [
      { id: 'complaint-1', question: 'Which phrase politely starts a complaint?', options: ['I want to complain now', "I'm not happy with...", 'This is terrible'], correctIndex: 1 },
      { id: 'complaint-2', question: 'What tone works best for "Could you look into this?"', options: ['Flat and sharp', 'Rising and gentle', 'Very loud'], correctIndex: 1 },
      { id: 'complaint-3', question: 'Which phrase shows a problem has happened before?', options: ["I'd like a refund", "It's the second time this has happened", 'This is what I expected'], correctIndex: 1 },
    ],
  },
  {
    key: 'giving_opinions',
    icon: 'message-circle',
    title: 'Giving Opinions',
    vocabulary: [
      { word: 'In my opinion...', meaning: 'Introduces a personal view', example: 'In my opinion, public transport here is very good.' },
      { word: 'I think that...', meaning: 'A common way to state an opinion', example: 'I think that the new bus route is much faster.' },
      { word: 'I agree / disagree', meaning: 'States agreement or disagreement', example: 'I agree with you about that.' },
      { word: 'On the other hand...', meaning: 'Introduces a contrasting view', example: 'On the other hand, it can be quite expensive.' },
      { word: 'That\'s a good point', meaning: 'Acknowledges someone else\'s opinion', example: "That's a good point — I hadn't thought of that." },
    ],
    pronunciationTip: "Stress the key opinion word: \"I THINK that's a good idea\" — this signals to the listener that a personal view is coming.",
    conversation: [
      { speaker: 'A', line: "In my opinion, working from home is much better for families." },
      { speaker: 'B', line: "That's a good point, but on the other hand, some people miss seeing their colleagues." },
    ],
    quiz: [
      { id: 'opinions-1', question: 'Which phrase introduces a contrasting opinion?', options: ['I agree', 'On the other hand', 'That\'s a good point'], correctIndex: 1 },
      { id: 'opinions-2', question: 'Which word should be stressed in "I think that\'s a good idea"?', options: ['I', 'THINK', 'idea'], correctIndex: 1 },
      { id: 'opinions-3', question: 'How do you acknowledge someone else\'s opinion politely?', options: ['That\'s wrong', 'That\'s a good point', 'I don\'t care'], correctIndex: 1 },
    ],
  },
  {
    key: 'comparing_options',
    icon: 'trending-up',
    title: 'Comparing Options',
    vocabulary: [
      { word: 'Cheaper / more expensive than', meaning: 'Compares cost', example: 'The bus is cheaper than the train.' },
      { word: 'Faster / slower than', meaning: 'Compares speed', example: 'Driving is faster than walking.' },
      { word: 'The best / worst option', meaning: 'Identifies the top or bottom choice', example: 'I think the second flat is the best option.' },
      { word: 'Both... and...', meaning: 'Describes two things sharing a quality', example: 'Both flats are close to the station.' },
      { word: 'Neither... nor...', meaning: 'Describes two things that lack a quality', example: 'Neither option has parking.' },
    ],
    pronunciationTip: 'Comparative "-er" endings are unstressed and quick: "CHEAP-er" not "cheap-ERR" — don\'t over-pronounce the ending.',
    conversation: [
      { speaker: 'A', line: 'Should we take the bus or the train to the airport?' },
      { speaker: 'B', line: "The train is faster, but the bus is cheaper than the train. I think the train is the best option if we're in a hurry." },
    ],
    quiz: [
      { id: 'compare-1', question: 'Which sentence compares cost?', options: ['Driving is faster than walking', 'The bus is cheaper than the train', 'Both flats are close to the station'], correctIndex: 1 },
      { id: 'compare-2', question: '"Neither... nor..." is used when:', options: ['Both things have a quality', 'Neither thing has a quality', 'Only one thing has a quality'], correctIndex: 1 },
      { id: 'compare-3', question: 'How is "cheaper" pronounced?', options: ['CHEAP-er (unstressed ending)', 'cheap-ERR (stressed ending)', 'che-AP-er'], correctIndex: 0 },
    ],
  },
  {
    key: 'planning_a_trip',
    icon: 'map',
    title: 'Planning a Trip',
    vocabulary: [
      { word: 'I\'m planning to...', meaning: 'Describes a future intention', example: "I'm planning to visit my sister in Leeds." },
      { word: 'We\'re thinking of...', meaning: 'A less certain future plan', example: "We're thinking of going away for the bank holiday." },
      { word: 'Book in advance', meaning: 'Reserve something before the date', example: 'It\'s cheaper if you book in advance.' },
      { word: 'Itinerary', meaning: 'A planned route or schedule for a trip', example: 'Our itinerary includes two days in York.' },
      { word: 'What\'s the best way to get to...?', meaning: 'Asks for travel advice', example: "What's the best way to get to Edinburgh from here?" },
    ],
    pronunciationTip: '"Itinerary" is a longer word — break it into parts: "eye-TIN-er-ary", with the main stress on the second syllable.',
    conversation: [
      { speaker: 'A', line: "We're thinking of going to Scotland this summer. What's the best way to get there?" },
      { speaker: 'B', line: 'The train is comfortable, but book in advance — it gets expensive close to the date.' },
    ],
    quiz: [
      { id: 'trip-1', question: 'Which phrase describes a less certain plan than "I\'m planning to"?', options: ["We're thinking of", 'Book in advance', 'Itinerary'], correctIndex: 0 },
      { id: 'trip-2', question: 'What does "book in advance" mean?', options: ['Reserve early', 'Cancel a booking', 'Travel without a ticket'], correctIndex: 0 },
      { id: 'trip-3', question: 'Where is the main stress in "itinerary"?', options: ['First syllable', 'Second syllable', 'Last syllable'], correctIndex: 1 },
    ],
  },
  {
    key: 'discussing_work_a2',
    icon: 'briefcase',
    title: 'Discussing Work in More Detail',
    vocabulary: [
      { word: 'I\'ve been working here for...', meaning: 'Describes how long you\'ve had a job (present perfect)', example: "I've been working here for eighteen months." },
      { word: 'My responsibilities include...', meaning: 'Describes job duties', example: 'My responsibilities include managing the rota.' },
      { word: 'I recently started / changed...', meaning: 'Describes a recent work change', example: 'I recently started a new role in the same company.' },
      { word: 'A typical day involves...', meaning: 'Describes a routine at work', example: 'A typical day involves checking emails and meeting clients.' },
      { word: 'I\'m hoping to...', meaning: 'Describes a work goal', example: "I'm hoping to get a promotion next year." },
    ],
    pronunciationTip: '"I\'ve been working" uses a linked, smooth sound — "I\'ve" and "been" blend together rather than being said as two separate, sharp words.',
    conversation: [
      { speaker: 'A', line: "How long have you been working at the hospital?" },
      { speaker: 'B', line: "I've been working here for two years now. My responsibilities include supporting the nursing team and managing supplies." },
    ],
    quiz: [
      { id: 'work-a2-1', question: 'Which phrase describes job duties?', options: ['I recently started', 'My responsibilities include', 'A typical day'], correctIndex: 1 },
      { id: 'work-a2-2', question: 'Which tense is used in "I\'ve been working here for two years"?', options: ['Simple past', 'Present perfect continuous', 'Future'], correctIndex: 1 },
      { id: 'work-a2-3', question: 'Which phrase describes a work goal?', options: ["I'm hoping to", 'A typical day involves', 'I recently changed'], correctIndex: 0 },
    ],
  },
  {
    key: 'describing_a_problem',
    icon: 'tool',
    title: 'Describing a Problem',
    vocabulary: [
      { word: 'There\'s something wrong with...', meaning: 'Reports a fault', example: "There's something wrong with the boiler." },
      { word: 'It stopped working', meaning: 'Describes something that broke', example: 'The washing machine stopped working yesterday.' },
      { word: 'It keeps happening', meaning: 'Describes a repeated issue', example: 'The wifi keeps disconnecting — it keeps happening every evening.' },
      { word: 'Since when has this been happening?', meaning: 'Asks about how long a problem has existed', example: 'Since when has this been happening?' },
      { word: 'I\'ve tried... but...', meaning: 'Describes an attempted solution that failed', example: "I've tried restarting it, but it hasn't helped." },
    ],
    pronunciationTip: '"Something\'s wrong with" — the "th" sound in "something" and "with" is soft; keep your tongue lightly between your teeth, not pressed hard.',
    conversation: [
      { speaker: 'A', line: "There's something wrong with the heating — it keeps switching off." },
      { speaker: 'B', line: "Since when has this been happening?" },
      { speaker: 'A', line: "Since last week. I've tried checking the thermostat, but it hasn't helped." },
    ],
    quiz: [
      { id: 'problem-1', question: 'Which phrase describes a repeated issue?', options: ['It stopped working', 'It keeps happening', "There's something wrong"], correctIndex: 1 },
      { id: 'problem-2', question: 'How is the "th" in "something" pronounced?', options: ['Like an "s" sound', 'Soft, tongue lightly between teeth', 'Like a "t" sound'], correctIndex: 1 },
      { id: 'problem-3', question: 'Which question asks how long a problem has existed?', options: ['What is wrong?', 'Since when has this been happening?', 'Has it stopped?'], correctIndex: 1 },
    ],
  },
  {
    key: 'asking_for_advice',
    icon: 'help-circle',
    title: 'Asking for Advice',
    vocabulary: [
      { word: 'What would you do?', meaning: 'Asks for someone\'s advice directly', example: 'What would you do in my situation?' },
      { word: 'Do you think I should...?', meaning: 'Asks for an opinion on an action', example: 'Do you think I should apply for the job?' },
      { word: 'I\'m not sure what to do about...', meaning: 'Expresses uncertainty', example: "I'm not sure what to do about the noisy neighbours." },
      { word: 'If I were you, I\'d...', meaning: 'A common way to give advice', example: "If I were you, I'd speak to the landlord first." },
      { word: 'That\'s worth considering', meaning: 'Responds positively to advice', example: "That's worth considering, thank you." },
    ],
    pronunciationTip: '"If I were you" is a fixed phrase — say it smoothly and quickly as one unit, not word by word.',
    conversation: [
      { speaker: 'A', line: "I'm not sure what to do about my working hours — they've become really long. What would you do?" },
      { speaker: 'B', line: "If I were you, I'd speak to my manager about it." },
      { speaker: 'A', line: "That's worth considering. Thank you." },
    ],
    quiz: [
      { id: 'advice-1', question: 'Which phrase gives advice directly?', options: ['What would you do?', "If I were you, I'd...", "I'm not sure what to do"], correctIndex: 1 },
      { id: 'advice-2', question: 'How should "If I were you" be said?', options: ['Word by word, slowly', 'Smoothly, as one unit', 'With a pause after "If"'], correctIndex: 1 },
      { id: 'advice-3', question: 'Which phrase responds positively to advice?', options: ["I'm not sure", "That's worth considering", 'What would you do?'], correctIndex: 1 },
    ],
  },
  {
    key: 'renewing_documents',
    icon: 'file-text',
    title: 'Renewing Documents',
    vocabulary: [
      { word: 'My visa is due to expire', meaning: 'Describes an upcoming expiry', example: 'My visa is due to expire in three months.' },
      { word: 'I need to renew...', meaning: 'Describes needing to extend a document', example: 'I need to renew my driving licence.' },
      { word: 'Apply in good time', meaning: 'Apply early, before a deadline', example: "It's best to apply in good time before it expires." },
      { word: 'Supporting documents', meaning: 'Evidence needed for an application', example: 'I gathered all my supporting documents first.' },
      { word: 'Processing time', meaning: 'How long an application takes to decide', example: 'The processing time was about eight weeks.' },
    ],
    pronunciationTip: '"Expire" is stressed on the second syllable: "ex-PIRE" — a common mistake is stressing the first syllable instead.',
    conversation: [
      { speaker: 'A', line: 'My visa is due to expire soon — I need to renew it.' },
      { speaker: 'B', line: 'Have you gathered your supporting documents? It\'s best to apply in good time.' },
    ],
    quiz: [
      { id: 'renew-1', question: 'Which syllable is stressed in "expire"?', options: ['First', 'Second', 'Neither'], correctIndex: 1 },
      { id: 'renew-2', question: 'What does "apply in good time" mean?', options: ['Apply late', 'Apply early, before a deadline', 'Apply only once'], correctIndex: 1 },
      { id: 'renew-3', question: 'What are "supporting documents"?', options: ['Documents that are out of date', 'Evidence needed for an application', 'A type of visa'], correctIndex: 1 },
    ],
  },
  {
    key: 'talking_about_experience',
    icon: 'star',
    title: 'Talking About Experience',
    vocabulary: [
      { word: 'Have you ever...?', meaning: 'Asks about life experience', example: 'Have you ever visited Scotland?' },
      { word: 'I\'ve never...', meaning: 'Describes something you haven\'t experienced', example: "I've never tried skiing." },
      { word: 'That was the first time I...', meaning: 'Introduces a new experience', example: 'That was the first time I flew on a plane.' },
      { word: 'It was quite an experience', meaning: 'A general comment about a memorable event', example: 'Moving to a new country was quite an experience.' },
      { word: 'I learned a lot from it', meaning: 'Reflects on the value of an experience', example: 'It was difficult, but I learned a lot from it.' },
    ],
    pronunciationTip: '"Have you ever" often reduces in speech to sound like "Have you EV-er" with a light, quick "you" — natural, relaxed speech, not over-enunciated.',
    conversation: [
      { speaker: 'A', line: 'Have you ever worked night shifts before?' },
      { speaker: 'B', line: "Yes — that was the first time I worked nights, actually, when I started this job. It was quite an experience, but I learned a lot from it." },
    ],
    quiz: [
      { id: 'experience-1', question: 'Which phrase introduces a new experience?', options: ['I\'ve never...', 'That was the first time I...', 'Have you ever...?'], correctIndex: 1 },
      { id: 'experience-2', question: 'What does "I learned a lot from it" express?', options: ['Regret', 'Reflection on value gained', 'Confusion'], correctIndex: 1 },
      { id: 'experience-3', question: 'How does "Have you ever" usually sound in natural speech?', options: ['Slow and separated', 'Relaxed and linked', 'Very formal'], correctIndex: 1 },
    ],
  },
  {
    key: 'explaining_a_delay',
    icon: 'clock',
    title: 'Explaining a Delay',
    vocabulary: [
      { word: 'I\'m running late because...', meaning: 'Explains lateness with a reason', example: "I'm running late because the bus didn't turn up." },
      { word: 'Sorry for the delay', meaning: 'A polite apology for lateness', example: 'Sorry for the delay — the traffic was terrible.' },
      { word: 'Something came up', meaning: 'A general reason for unexpected lateness', example: 'Something came up at work, so I left later than planned.' },
      { word: 'I should be there in...', meaning: 'Gives an estimated arrival time', example: 'I should be there in about ten minutes.' },
      { word: 'It couldn\'t be helped', meaning: 'Explains a delay was outside your control', example: 'The delay couldn\'t be helped — the train broke down.' },
    ],
    pronunciationTip: '"Couldn\'t be helped" is a fixed, sympathetic phrase — say it with a falling, resigned tone, not an angry one.',
    conversation: [
      { speaker: 'A', line: "Sorry for the delay — I'm running late because the trains were cancelled." },
      { speaker: 'B', line: "Don't worry, it couldn't be helped. How long until you get here?" },
      { speaker: 'A', line: 'I should be there in about fifteen minutes.' },
    ],
    quiz: [
      { id: 'delay-1', question: 'Which phrase gives an estimated arrival time?', options: ['Something came up', 'I should be there in...', 'Sorry for the delay'], correctIndex: 1 },
      { id: 'delay-2', question: 'What tone suits "It couldn\'t be helped"?', options: ['Angry', 'Falling and resigned', 'Excited'], correctIndex: 1 },
      { id: 'delay-3', question: 'Which phrase gives a vague, general reason for lateness?', options: ['Something came up', 'I should be there in ten minutes', 'Sorry for the delay'], correctIndex: 0 },
    ],
  },
  {
    key: 'discussing_future_plans_a2',
    icon: 'compass',
    title: 'Discussing Future Plans',
    vocabulary: [
      { word: 'I\'m planning on...', meaning: 'States a future intention', example: "I'm planning on studying part-time next year." },
      { word: 'Eventually, I\'d like to...', meaning: 'Describes a longer-term goal', example: "Eventually, I'd like to buy a house." },
      { word: 'It depends on...', meaning: 'Shows a plan has conditions', example: 'It depends on whether I get the job.' },
      { word: 'In the next few years...', meaning: 'Gives a rough future timeframe', example: 'In the next few years, I want to improve my English further.' },
      { word: 'I haven\'t decided yet', meaning: 'Shows a plan isn\'t finalised', example: "I haven't decided yet whether to stay or move." },
    ],
    pronunciationTip: '"Eventually" is stressed on the second syllable: "e-VEN-tu-ally" — say it in one flowing word, not broken up.',
    conversation: [
      { speaker: 'A', line: 'What are your plans for the next few years?' },
      { speaker: 'B', line: "I'm planning on improving my English and finding a better job. Eventually, I'd like to bring the rest of my family here too, but it depends on my visa situation." },
    ],
    quiz: [
      { id: 'future-a2-1', question: 'Which phrase shows a plan has conditions?', options: ['It depends on', 'I\'m planning on', 'Eventually'], correctIndex: 0 },
      { id: 'future-a2-2', question: 'Where is the stress in "eventually"?', options: ['First syllable', 'Second syllable', 'Last syllable'], correctIndex: 1 },
      { id: 'future-a2-3', question: 'Which phrase shows a plan isn\'t finalised?', options: ["I'd like to", "I haven't decided yet", 'In the next few years'], correctIndex: 1 },
    ],
  },
  {
    key: 'describing_your_neighbourhood',
    icon: 'home',
    title: 'Describing Your Neighbourhood',
    vocabulary: [
      { word: 'A quiet / lively area', meaning: 'Describes the character of a place', example: 'It\'s a quiet area, good for families.' },
      { word: 'Within walking distance', meaning: 'Describes something close by', example: 'The shops are within walking distance.' },
      { word: 'It\'s well connected', meaning: 'Describes good transport links', example: 'It\'s well connected — there\'s a train station nearby.' },
      { word: 'The community is...', meaning: 'Describes the local people/atmosphere', example: 'The community here is really friendly.' },
      { word: 'It\'s changed a lot over the years', meaning: 'Describes how an area has developed', example: 'This street has changed a lot over the years.' },
    ],
    pronunciationTip: '"Neighbourhood" is stressed on the first syllable: "NAY-ber-hood" — the "gh" is silent.',
    conversation: [
      { speaker: 'A', line: 'What\'s your neighbourhood like?' },
      { speaker: 'B', line: "It's a quiet area, and it's well connected — the shops and the station are within walking distance. The community is really friendly too." },
    ],
    quiz: [
      { id: 'neighbourhood-1', question: 'How is "neighbourhood" pronounced?', options: ['nay-ber-HOOD', 'NAY-ber-hood', 'neigh-BOUR-hood'], correctIndex: 1 },
      { id: 'neighbourhood-2', question: 'What does "well connected" describe?', options: ['Friendly people', 'Good transport links', 'A quiet area'], correctIndex: 1 },
      { id: 'neighbourhood-3', question: 'What does "within walking distance" mean?', options: ['Far away', 'Close by, reachable on foot', 'Only by car'], correctIndex: 1 },
    ],
  },
  {
    key: 'discussing_a_recent_purchase',
    icon: 'shopping-bag',
    title: 'Discussing a Recent Purchase',
    vocabulary: [
      { word: 'I recently bought...', meaning: 'Introduces a recent purchase', example: 'I recently bought a new washing machine.' },
      { word: 'It was good value for money', meaning: 'Describes a purchase as worth the price', example: 'It was good value for money for the quality.' },
      { word: 'I compared a few options first', meaning: 'Describes shopping around before buying', example: 'I compared a few options first before deciding.' },
      { word: 'It came with a guarantee', meaning: 'Describes a product warranty', example: 'It came with a two-year guarantee.' },
      { word: 'I\'d recommend it', meaning: 'Gives a positive recommendation', example: "I'd recommend it — it's been really reliable." },
    ],
    pronunciationTip: '"Guarantee" is stressed on the last syllable: "ga-ran-TEE" — a common mistake is stressing the first syllable.',
    conversation: [
      { speaker: 'A', line: "I recently bought a new phone. I compared a few options first, and I think it was good value for money." },
      { speaker: 'B', line: 'Did it come with a guarantee?' },
      { speaker: 'A', line: 'Yes, a two-year one. I\'d recommend it.' },
    ],
    quiz: [
      { id: 'purchase-1', question: 'Where is the stress in "guarantee"?', options: ['First syllable', 'Middle syllable', 'Last syllable'], correctIndex: 2 },
      { id: 'purchase-2', question: 'What does "good value for money" mean?', options: ['Very expensive', 'Worth the price', 'Poor quality'], correctIndex: 1 },
      { id: 'purchase-3', question: 'Which phrase describes shopping around first?', options: ['I recently bought', 'I compared a few options first', 'It came with a guarantee'], correctIndex: 1 },
    ],
  },
  {
    key: 'explaining_symptoms_in_detail',
    icon: 'activity',
    title: 'Explaining Symptoms in Detail',
    vocabulary: [
      { word: 'It started about... ago', meaning: 'Describes when a symptom began', example: 'It started about three days ago.' },
      { word: 'It gets worse when...', meaning: 'Describes what makes a symptom worse', example: 'The pain gets worse when I stand up.' },
      { word: 'On and off', meaning: 'Describes something that comes and goes', example: 'I\'ve had a headache on and off all week.' },
      { word: 'It\'s a dull / sharp pain', meaning: 'Describes the type of pain', example: 'It\'s more of a dull pain than a sharp one.' },
      { word: 'I\'ve also noticed...', meaning: 'Adds an additional symptom', example: 'I\'ve also noticed I\'ve been more tired than usual.' },
    ],
    pronunciationTip: '"On and off" is said as one smooth phrase, with light stress on "on" and "off" and a quick, unstressed "and" between them.',
    conversation: [
      { speaker: 'A', line: 'When did the pain start?' },
      { speaker: 'B', line: "It started about a week ago. It's a dull pain, and it gets worse when I bend down. I've also noticed some swelling." },
    ],
    quiz: [
      { id: 'symptoms-1', question: 'Which phrase describes something that comes and goes?', options: ['On and off', 'It started about', 'Dull pain'], correctIndex: 0 },
      { id: 'symptoms-2', question: 'What does "it gets worse when..." describe?', options: ['When a symptom began', 'What makes a symptom worse', 'A new symptom'], correctIndex: 1 },
      { id: 'symptoms-3', question: 'How should "on and off" be pronounced?', options: ['Slowly, word by word', 'As one smooth phrase', 'With heavy stress on "and"'], correctIndex: 1 },
    ],
  },
];

// B1 — settlement (ILR) and citizenship stage. More abstract, extended
// discourse than A1/A2: explaining reasons and processes, discussing
// community and civic life, not just describing everyday situations.
export const LESSONS_B1: Lesson[] = [
  {
    key: 'explaining_a_process',
    icon: 'list',
    title: 'Explaining a Process',
    vocabulary: [
      { word: 'The first step is to...', meaning: 'Introduces the start of a process', example: 'The first step is to gather your documents.' },
      { word: 'Once you\'ve done that,...', meaning: 'Links one step to the next', example: "Once you've done that, you can submit the form." },
      { word: 'It usually takes...', meaning: 'Describes typical duration', example: 'It usually takes about six weeks to process.' },
      { word: 'Make sure you...', meaning: 'Highlights an important step', example: 'Make sure you keep a copy of everything.' },
      { word: 'The final stage involves...', meaning: 'Describes the last part of a process', example: 'The final stage involves an interview.' },
    ],
    pronunciationTip: 'When explaining steps, pause briefly between each one — this helps the listener follow the sequence, especially with longer B1-level explanations.',
    conversation: [
      { speaker: 'A', line: 'Can you explain how you applied for settlement?' },
      { speaker: 'B', line: "Of course. The first step is to check you're eligible. Once you've done that, you gather your documents and submit the application online — it usually takes a few months to get a decision." },
    ],
    quiz: [
      { id: 'process-1', question: 'Which phrase links one step to the next?', options: ['The first step is to', "Once you've done that", 'It usually takes'], correctIndex: 1 },
      { id: 'process-2', question: 'Why pause between steps when explaining a process?', options: ['To sound uncertain', 'To help the listener follow the sequence', 'It has no effect'], correctIndex: 1 },
      { id: 'process-3', question: 'Which phrase highlights an important step?', options: ['Make sure you...', 'It usually takes...', 'The final stage'], correctIndex: 0 },
    ],
  },
  {
    key: 'discussing_community_involvement',
    icon: 'users',
    title: 'Discussing Community Involvement',
    vocabulary: [
      { word: 'I\'m involved in...', meaning: 'Describes participation in a group or activity', example: "I'm involved in our local residents' association." },
      { word: 'It gives me a sense of belonging', meaning: 'Describes feeling part of a community', example: 'Volunteering gives me a sense of belonging here.' },
      { word: 'I got involved because...', meaning: 'Explains a reason for joining something', example: 'I got involved because I wanted to give something back.' },
      { word: 'It\'s a good way to meet people', meaning: 'Describes a social benefit', example: 'Joining the community centre is a good way to meet people.' },
      { word: 'We organise / take part in...', meaning: 'Describes community activities', example: 'We organise a street clean-up every spring.' },
    ],
    pronunciationTip: '"Belonging" is stressed on the second syllable: "be-LONG-ing" — a soft, warm tone fits this topic well.',
    conversation: [
      { speaker: 'A', line: 'Are you involved in anything in your local community?' },
      { speaker: 'B', line: "Yes, I'm involved in the community garden. I got involved because it's a good way to meet people, and it gives me a real sense of belonging here." },
    ],
    quiz: [
      { id: 'community-1', question: 'Which phrase explains a reason for joining something?', options: ["I'm involved in", 'I got involved because', 'We organise'], correctIndex: 1 },
      { id: 'community-2', question: 'Where is the stress in "belonging"?', options: ['First syllable', 'Second syllable', 'Last syllable'], correctIndex: 1 },
      { id: 'community-3', question: 'What does "a sense of belonging" describe?', options: ['Feeling like an outsider', 'Feeling part of a community', 'Being very busy'], correctIndex: 1 },
    ],
  },
  {
    key: 'describing_future_plans_b1',
    icon: 'compass',
    title: 'Describing Future Plans in Detail',
    vocabulary: [
      { word: 'My long-term goal is...', meaning: 'Describes an ambitious future aim', example: 'My long-term goal is to start my own business.' },
      { word: 'I\'m working towards...', meaning: 'Describes progress toward a goal', example: "I'm working towards a professional qualification." },
      { word: 'Assuming everything goes to plan,...', meaning: 'Introduces a plan with conditions', example: 'Assuming everything goes to plan, I\'ll qualify next year.' },
      { word: 'In the meantime,...', meaning: 'Describes what happens while waiting', example: "In the meantime, I'm gaining more experience at work." },
      { word: 'It\'s something I\'ve always wanted to do', meaning: 'Expresses a long-held ambition', example: "It's something I've always wanted to do." },
    ],
    pronunciationTip: '"Assuming everything goes to plan" — link the words smoothly, with the main stress on "plan" at the end.',
    conversation: [
      { speaker: 'A', line: 'What are your long-term goals?' },
      { speaker: 'B', line: "My long-term goal is to become a qualified accountant — it's something I've always wanted to do. I'm working towards it now, and in the meantime, I'm building up my experience." },
    ],
    quiz: [
      { id: 'future-b1-1', question: 'Which phrase describes what happens while waiting for a goal?', options: ['In the meantime', 'My long-term goal', "I'm working towards"], correctIndex: 0 },
      { id: 'future-b1-2', question: 'Which phrase introduces a plan with conditions?', options: ['Assuming everything goes to plan', 'In the meantime', "It's something I've always wanted"], correctIndex: 0 },
      { id: 'future-b1-3', question: 'Where is the main stress in "Assuming everything goes to plan"?', options: ['On "Assuming"', 'On "everything"', 'On "plan"'], correctIndex: 2 },
    ],
  },
  {
    key: 'workplace_communication_b1',
    icon: 'briefcase',
    title: 'Workplace Communication',
    vocabulary: [
      { word: 'I\'d like to raise an issue', meaning: 'A formal way to bring up a problem at work', example: "I'd like to raise an issue about the rota." },
      { word: 'Could we schedule a meeting to discuss...?', meaning: 'Formally requests a discussion', example: 'Could we schedule a meeting to discuss my workload?' },
      { word: 'I appreciate your feedback', meaning: 'Politely acknowledges criticism or advice', example: "I appreciate your feedback — I'll work on it." },
      { word: 'To clarify,...', meaning: 'Used to explain something more precisely', example: 'To clarify, the deadline is Friday, not Monday.' },
      { word: 'I\'ll follow up on that', meaning: 'Confirms you will take further action', example: "I'll follow up on that email this afternoon." },
    ],
    pronunciationTip: 'Formal workplace phrases benefit from a calm, even pace — rushing "I\'d like to raise an issue" can make it sound like a complaint rather than a professional request.',
    conversation: [
      { speaker: 'A', line: "I'd like to raise an issue about the new shift pattern, if that's alright." },
      { speaker: 'B', line: "Of course. Could we schedule a meeting to discuss it properly this week?" },
      { speaker: 'A', line: "Yes, that works. I'll follow up on that by email." },
    ],
    quiz: [
      { id: 'workplace-b1-1', question: 'Which phrase formally requests a discussion?', options: ["I'd like to raise an issue", 'Could we schedule a meeting to discuss...?', 'To clarify'], correctIndex: 1 },
      { id: 'workplace-b1-2', question: 'What pace suits formal workplace requests?', options: ['Very fast', 'Calm and even', 'Very quiet'], correctIndex: 1 },
      { id: 'workplace-b1-3', question: 'Which phrase confirms you\'ll take further action?', options: ['I appreciate your feedback', "I'll follow up on that", 'To clarify'], correctIndex: 1 },
    ],
  },
  {
    key: 'discussing_news_and_current_events',
    icon: 'globe',
    title: 'Discussing News and Current Events',
    vocabulary: [
      { word: 'Have you seen the news about...?', meaning: 'Introduces a current events topic', example: 'Have you seen the news about the local elections?' },
      { word: 'It\'s been widely reported that...', meaning: 'Introduces a well-known news fact', example: "It's been widely reported that prices have gone up." },
      { word: 'It affects a lot of people', meaning: 'Describes the wider impact of an issue', example: 'The rise in energy costs affects a lot of people.' },
      { word: 'I try to keep up with...', meaning: 'Describes following news regularly', example: 'I try to keep up with local news.' },
      { word: 'It\'s a complicated issue', meaning: 'Acknowledges a topic has no simple answer', example: "It's a complicated issue with no easy solution." },
    ],
    pronunciationTip: '"Widely reported" — stress both main words evenly: "WIDE-ly re-POR-ted" — this phrase is common in more formal B1-level discussion.',
    conversation: [
      { speaker: 'A', line: 'Have you seen the news about the new recycling rules?' },
      { speaker: 'B', line: "Yes, it's been widely reported. It affects a lot of people, and I think it's quite a complicated issue to get right." },
    ],
    quiz: [
      { id: 'news-1', question: 'Which phrase introduces a well-known news fact?', options: ['Have you seen the news about...?', "It's been widely reported that...", 'I try to keep up with'], correctIndex: 1 },
      { id: 'news-2', question: 'What does "it affects a lot of people" describe?', options: ['A small, local issue', 'Wide impact', 'Something with no importance'], correctIndex: 1 },
      { id: 'news-3', question: 'Which phrase acknowledges no easy answer exists?', options: ["It's a complicated issue", 'I try to keep up with', 'Have you seen the news'], correctIndex: 0 },
    ],
  },
  {
    key: 'civic_responsibilities',
    icon: 'shield',
    title: 'Civic Responsibilities',
    vocabulary: [
      { word: 'Voting', meaning: 'Taking part in an election', example: 'Voting is an important part of local democracy.' },
      { word: 'Jury service', meaning: 'A civic duty to serve on a jury if selected', example: 'I was called for jury service last year.' },
      { word: 'Paying taxes', meaning: 'A legal financial responsibility', example: 'Paying taxes helps fund public services like the NHS.' },
      { word: 'Obeying the law', meaning: 'Following the rules of the country', example: 'Obeying the law is expected of everyone living here.' },
      { word: 'Respecting others\' rights', meaning: 'A civic and social responsibility', example: 'Respecting others\' rights is part of living in a diverse society.' },
    ],
    pronunciationTip: '"Responsibility" is a long word — break it down: "re-spon-si-BIL-i-ty", with the main stress on the fourth syllable.',
    conversation: [
      { speaker: 'A', line: 'What do you think are the main responsibilities of living in the UK?' },
      { speaker: 'B', line: 'I\'d say obeying the law, paying taxes, and voting when you\'re eligible. Respecting others\' rights is important too, especially in such a diverse society.' },
    ],
    quiz: [
      { id: 'civic-1', question: 'Where is the main stress in "responsibility"?', options: ['First syllable', 'Fourth syllable', 'Last syllable'], correctIndex: 1 },
      { id: 'civic-2', question: 'What is "jury service"?', options: ['A type of tax', 'A civic duty to serve on a jury', 'A voting method'], correctIndex: 1 },
      { id: 'civic-3', question: 'What does "obeying the law" mean?', options: ['Ignoring rules', 'Following the rules of the country', 'Voting in elections'], correctIndex: 1 },
    ],
  },
  {
    key: 'discussing_environmental_issues',
    icon: 'sun',
    title: 'Discussing Environmental Issues',
    vocabulary: [
      { word: 'Climate change', meaning: 'Long-term change in global weather patterns', example: 'Climate change is a topic people discuss a lot now.' },
      { word: 'Reduce our carbon footprint', meaning: 'Lower the environmental impact of our actions', example: 'We try to reduce our carbon footprint by cycling more.' },
      { word: 'Sustainable', meaning: 'Able to continue without harming the environment', example: 'We try to buy more sustainable products.' },
      { word: 'Renewable energy', meaning: 'Energy from sources like wind or solar power', example: 'More homes are switching to renewable energy.' },
      { word: 'It\'s a shared responsibility', meaning: 'Describes something everyone should contribute to', example: 'Protecting the environment is a shared responsibility.' },
    ],
    pronunciationTip: '"Sustainable" is stressed on the second syllable: "su-STAIN-a-ble" — a very common B1-level topic word, worth practising until it feels natural.',
    conversation: [
      { speaker: 'A', line: 'Do you think about your carbon footprint much?' },
      { speaker: 'B', line: "Yes, I try to. We recycle, use less energy, and try to buy sustainable products where we can. I think it's a shared responsibility, really." },
    ],
    quiz: [
      { id: 'environment-1', question: 'Where is the stress in "sustainable"?', options: ['First syllable', 'Second syllable', 'Last syllable'], correctIndex: 1 },
      { id: 'environment-2', question: 'What is "renewable energy"?', options: ['Energy from oil', 'Energy from sources like wind or solar', 'Energy that never runs out of cost'], correctIndex: 1 },
      { id: 'environment-3', question: 'What does "a shared responsibility" mean?', options: ['Only the government\'s job', 'Something everyone should contribute to', 'Not important'], correctIndex: 1 },
    ],
  },
  {
    key: 'talking_about_cultural_differences',
    icon: 'globe',
    title: 'Talking About Cultural Differences',
    vocabulary: [
      { word: 'One thing I\'ve noticed is...', meaning: 'Introduces an observation about a difference', example: "One thing I've noticed is how much people queue here." },
      { word: 'It\'s quite different from...', meaning: 'Compares a UK custom to something else', example: "It's quite different from how we celebrate at home." },
      { word: 'I\'ve had to adapt to...', meaning: 'Describes adjusting to a new custom', example: "I've had to adapt to the different working hours here." },
      { word: 'There are similarities too', meaning: 'Balances a comparison with common ground', example: 'There are similarities too — families are just as important.' },
      { word: 'It took some getting used to', meaning: 'Describes a gradual adjustment', example: 'The weather here took some getting used to.' },
    ],
    pronunciationTip: '"It took some getting used to" — this is a common, natural-sounding phrase; practise saying it as one flowing unit rather than word by word.',
    conversation: [
      { speaker: 'A', line: 'What differences have you noticed between here and your home country?' },
      { speaker: 'B', line: "One thing I've noticed is how punctual people are here — it's quite different from home, and it took some getting used to. But there are similarities too, like how much people value family." },
    ],
    quiz: [
      { id: 'culture-1', question: 'Which phrase introduces an observation?', options: ["One thing I've noticed is", "There are similarities too", "It's quite different from"], correctIndex: 0 },
      { id: 'culture-2', question: 'What does "it took some getting used to" mean?', options: ['It was instant', 'It required a gradual adjustment', 'It never changed'], correctIndex: 1 },
      { id: 'culture-3', question: 'Which phrase balances a comparison with common ground?', options: ["I've had to adapt to", 'There are similarities too', "It's quite different from"], correctIndex: 1 },
    ],
  },
  {
    key: 'explaining_a_decision',
    icon: 'check-square',
    title: 'Explaining a Decision',
    vocabulary: [
      { word: 'I decided to... because...', meaning: 'States a decision with a reason', example: 'I decided to apply for settlement because I want to stay long-term.' },
      { word: 'After thinking it over,...', meaning: 'Shows a decision was carefully considered', example: 'After thinking it over, I chose the smaller flat.' },
      { word: 'The main reason was...', meaning: 'Highlights the most important factor', example: 'The main reason was the good schools nearby.' },
      { word: 'I weighed up the pros and cons', meaning: 'Describes comparing advantages and disadvantages', example: 'I weighed up the pros and cons before deciding.' },
      { word: 'Looking back, it was the right choice', meaning: 'Reflects positively on a past decision', example: 'Looking back, it was the right choice for our family.' },
    ],
    pronunciationTip: "\"Weighed up\" sounds like \"way'd up\" — the \"eigh\" in \"weighed\" is pronounced like the \"ay\" in \"day\".",
    conversation: [
      { speaker: 'A', line: 'Why did you decide to settle in this city rather than move elsewhere?' },
      { speaker: 'B', line: "I weighed up the pros and cons, and the main reason was my children's school. Looking back, it was the right choice." },
    ],
    quiz: [
      { id: 'decision-1', question: 'How is "weighed" pronounced?', options: ['Like "wide"', 'Like "way\'d"', 'Like "width"'], correctIndex: 1 },
      { id: 'decision-2', question: 'Which phrase highlights the most important factor?', options: ['The main reason was', 'After thinking it over', 'Looking back'], correctIndex: 0 },
      { id: 'decision-3', question: 'What does "weighed up the pros and cons" mean?', options: ['Ignored the details', 'Compared advantages and disadvantages', 'Made a quick, careless choice'], correctIndex: 1 },
    ],
  },
  {
    key: 'discussing_further_education',
    icon: 'book-open',
    title: 'Discussing Further Education',
    vocabulary: [
      { word: 'I\'m considering studying...', meaning: 'Describes a possible education plan', example: "I'm considering studying for a diploma in accounting." },
      { word: 'It would improve my career prospects', meaning: 'Explains a benefit of further study', example: 'A qualification would improve my career prospects.' },
      { word: 'Part-time / evening course', meaning: 'Describes flexible study options', example: "I'm looking at an evening course so I can keep working." },
      { word: 'It\'s a big commitment', meaning: 'Acknowledges the effort required', example: 'Studying alongside a full-time job is a big commitment.' },
      { word: 'It would open up new opportunities', meaning: 'Describes future benefits', example: 'This qualification would open up new opportunities for me.' },
    ],
    pronunciationTip: '"Commitment" is stressed on the second syllable: "com-MIT-ment" — say it clearly, as it\'s a key word in this kind of discussion.',
    conversation: [
      { speaker: 'A', line: "I'm considering studying for a qualification in healthcare management." },
      { speaker: 'B', line: 'That sounds like a good move — it would improve your career prospects. Would you study full-time?' },
      { speaker: 'A', line: "No, an evening course — it's a big commitment alongside work, but it would open up new opportunities." },
    ],
    quiz: [
      { id: 'education-1', question: 'Where is the stress in "commitment"?', options: ['First syllable', 'Second syllable', 'Last syllable'], correctIndex: 1 },
      { id: 'education-2', question: 'What does "it would open up new opportunities" describe?', options: ['A risk', 'A future benefit', 'A cost'], correctIndex: 1 },
      { id: 'education-3', question: 'What is a benefit of a "part-time / evening course"?', options: ['You must stop working', 'Flexibility to keep working', 'It is always free'], correctIndex: 1 },
    ],
  },
  {
    key: 'describing_a_challenge_overcome',
    icon: 'trending-up',
    title: 'Describing a Challenge You\'ve Overcome',
    vocabulary: [
      { word: 'One of the biggest challenges was...', meaning: 'Introduces a significant difficulty', example: 'One of the biggest challenges was learning to drive here.' },
      { word: 'I struggled with... at first', meaning: 'Describes initial difficulty', example: 'I struggled with the language at first.' },
      { word: 'Over time, I managed to...', meaning: 'Describes gradual improvement', example: 'Over time, I managed to build my confidence.' },
      { word: 'It taught me to...', meaning: 'Describes a lesson learned', example: 'It taught me to be more patient with myself.' },
      { word: 'I\'m proud of how far I\'ve come', meaning: 'Expresses pride in progress', example: "I'm proud of how far I've come since arriving here." },
    ],
    pronunciationTip: '"I\'m proud of how far I\'ve come" — put gentle stress on "proud" and "far" to convey genuine feeling, not a flat, list-like tone.',
    conversation: [
      { speaker: 'A', line: 'What was one of the biggest challenges you\'ve faced since moving here?' },
      { speaker: 'B', line: "I struggled with the language at first, but over time, I managed to improve a lot. It taught me to be patient, and I'm proud of how far I've come." },
    ],
    quiz: [
      { id: 'challenge-1', question: 'Which phrase describes gradual improvement?', options: ['I struggled with... at first', 'Over time, I managed to...', 'One of the biggest challenges'], correctIndex: 1 },
      { id: 'challenge-2', question: 'What tone suits "I\'m proud of how far I\'ve come"?', options: ['Flat and list-like', 'Genuine, with gentle stress', 'Very fast'], correctIndex: 1 },
      { id: 'challenge-3', question: 'Which phrase describes a lesson learned?', options: ['It taught me to...', 'I struggled with', 'One of the biggest challenges was'], correctIndex: 0 },
    ],
  },
  {
    key: 'volunteering',
    icon: 'heart',
    title: 'Volunteering',
    vocabulary: [
      { word: 'I volunteer at...', meaning: 'Describes where you give unpaid help', example: 'I volunteer at a local food bank.' },
      { word: 'Giving something back', meaning: 'Describes helping the community in return for benefits received', example: 'I like giving something back to the community.' },
      { word: 'It\'s rewarding', meaning: 'Describes something personally satisfying', example: 'Volunteering is really rewarding, even if it\'s unpaid.' },
      { word: 'I help out with...', meaning: 'Describes specific volunteer tasks', example: 'I help out with the weekend reading club.' },
      { word: 'It doesn\'t feel like work', meaning: 'Expresses enjoyment of an activity', example: "Honestly, it doesn't feel like work — I really enjoy it." },
    ],
    pronunciationTip: '"Rewarding" is stressed on the second syllable: "re-WARD-ing" — a warm, genuine tone fits well here.',
    conversation: [
      { speaker: 'A', line: 'Do you do any volunteering?' },
      { speaker: 'B', line: "Yes, I volunteer at a food bank on Saturdays. I help out with sorting donations. It's rewarding, and honestly, it doesn't feel like work." },
    ],
    quiz: [
      { id: 'volunteer-1', question: 'Where is the stress in "rewarding"?', options: ['First syllable', 'Second syllable', 'Last syllable'], correctIndex: 1 },
      { id: 'volunteer-2', question: 'What does "giving something back" mean?', options: ['Returning a purchase', 'Helping the community', 'Asking for a refund'], correctIndex: 1 },
      { id: 'volunteer-3', question: 'Which phrase expresses enjoyment of volunteering?', options: ["It doesn't feel like work", 'I volunteer at', 'I help out with'], correctIndex: 0 },
    ],
  },
  {
    key: 'local_government_and_voting',
    icon: 'flag',
    title: 'Local Government and Voting',
    vocabulary: [
      { word: 'Local council', meaning: 'The local government body for an area', example: 'The local council is responsible for bin collection.' },
      { word: 'Local elections', meaning: 'Elections for local representatives', example: 'Local elections happen every few years.' },
      { word: 'Register to vote', meaning: 'Sign up to be eligible to vote', example: 'You need to register to vote before an election.' },
      { word: 'A councillor', meaning: 'An elected local representative', example: 'Our local councillor helped fix the streetlights.' },
      { word: 'It affects local services', meaning: 'Describes the impact of local decisions', example: 'Council decisions affect local services like libraries.' },
    ],
    pronunciationTip: '"Councillor" and "council" are easy to confuse — "council" is the organisation, "councillor" (with an extra syllable) is the person: "COUN-sil-lor".',
    conversation: [
      { speaker: 'A', line: 'Do you follow local politics much?' },
      { speaker: 'B', line: "A bit — I registered to vote in the last local elections. It affects local services, so I think it's worth paying attention to." },
    ],
    quiz: [
      { id: 'local-gov-1', question: 'What is the difference between "council" and "councillor"?', options: ['No difference', 'Council is the organisation, councillor is the person', 'Councillor is the organisation'], correctIndex: 1 },
      { id: 'local-gov-2', question: 'What do you need to do before you can vote?', options: ['Nothing', 'Register to vote', 'Join a political party'], correctIndex: 1 },
      { id: 'local-gov-3', question: 'What does the local council do?', options: ['Nothing relevant to residents', 'Manage local services', 'Only handle national issues'], correctIndex: 1 },
    ],
  },
  {
    key: 'discussing_healthcare_system',
    icon: 'activity',
    title: 'Discussing the Healthcare System',
    vocabulary: [
      { word: 'Register with a GP', meaning: 'Sign up with a local doctor\'s surgery', example: 'You should register with a GP as soon as you move.' },
      { word: 'It\'s free at the point of use', meaning: 'Describes the NHS funding model', example: 'The NHS is free at the point of use for most treatment.' },
      { word: 'Waiting times can vary', meaning: 'Describes differences in how long care takes', example: 'Waiting times can vary depending on the treatment.' },
      { word: 'Preventative care', meaning: 'Healthcare aimed at preventing illness', example: 'Preventative care, like check-ups, is really encouraged.' },
      { word: 'I have a lot of confidence in...', meaning: 'Expresses trust in a system', example: 'I have a lot of confidence in the local hospital.' },
    ],
    pronunciationTip: '"Preventative" is stressed on the second syllable: "pre-VENT-a-tive" — worth practising slowly first, as it\'s a longer word.',
    conversation: [
      { speaker: 'A', line: 'What do you think of the healthcare system here?' },
      { speaker: 'B', line: "Overall, I have a lot of confidence in it. It's free at the point of use, which was a big change for me, though waiting times can vary a lot depending on what you need." },
    ],
    quiz: [
      { id: 'healthcare-1', question: 'What does "free at the point of use" mean?', options: ['Fully privatised', 'No payment needed when receiving care', 'Only free for children'], correctIndex: 1 },
      { id: 'healthcare-2', question: 'What is "preventative care"?', options: ['Care that treats emergencies only', 'Care aimed at preventing illness', 'Care only for the elderly'], correctIndex: 1 },
      { id: 'healthcare-3', question: 'Where is the stress in "preventative"?', options: ['First syllable', 'Second syllable', 'Last syllable'], correctIndex: 1 },
    ],
  },
  {
    key: 'life_in_the_uk_and_citizenship',
    icon: 'award',
    title: 'Life in the UK and Citizenship',
    vocabulary: [
      { word: 'Becoming a citizen', meaning: 'The process of naturalisation', example: "I'm hoping to apply for becoming a citizen next year." },
      { word: 'The Life in the UK Test', meaning: 'A separate test on British history, culture and society required for citizenship', example: 'I need to pass the Life in the UK Test as well as my English test.' },
      { word: 'A sense of commitment to this country', meaning: 'Describes feeling settled and invested', example: 'Applying for citizenship reflects my commitment to this country.' },
      { word: 'It means a lot to me', meaning: 'Expresses the personal importance of something', example: 'Becoming a citizen means a lot to me and my family.' },
      { word: 'A new chapter', meaning: 'Describes a significant life change', example: "Citizenship feels like a new chapter for our family."},
    ],
    pronunciationTip: 'This topic often comes up naturally at B1 level — practise saying "The Life in the UK Test" as a fixed phrase, with even stress across "Life", "UK", and "Test".',
    conversation: [
      { speaker: 'A', line: 'Are you planning to apply for citizenship?' },
      { speaker: 'B', line: "Yes, eventually. I'll need to pass the Life in the UK Test alongside my English requirement. It means a lot to me — it feels like a new chapter for our family." },
    ],
    quiz: [
      { id: 'citizenship-1', question: 'What is the Life in the UK Test?', options: ['An English speaking test', 'A separate test on British history, culture and society', 'A driving test'], correctIndex: 1 },
      { id: 'citizenship-2', question: 'For citizenship, what is usually required alongside the English requirement?', options: ['Nothing else', 'The Life in the UK Test', 'A university degree'], correctIndex: 1 },
      { id: 'citizenship-3', question: 'What does "a new chapter" describe?', options: ['A book', 'A significant life change', 'A test section'], correctIndex: 1 },
    ],
  },
];

const LESSONS_BY_LEVEL: Record<CEFRLevel, Lesson[]> = {
  a1: LESSONS_A1,
  a2: LESSONS_A2,
  b1: LESSONS_B1,
};

export function getLessonsForLevel(level: CEFRLevel): Lesson[] {
  return LESSONS_BY_LEVEL[level];
}

export function getLesson(level: CEFRLevel, key: string): Lesson | undefined {
  return LESSONS_BY_LEVEL[level].find((l) => l.key === key);
}

export const FAKE_DATA = Array.from({ length: 100 }, (_, k) => ({
    id: k + 1,
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    progress: Math.floor(Math.random() * 100).toString(),
    fruit: FRUITS[Math.floor(Math.random() * FRUITS.length)],
  }));
  
  export const NAMES = [
    'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 
    'Charlotte', 'Theodore', 'Isla', 'Oliver'
  ];
  
  export const FRUITS = [
    'blueberry', 'lychee', 'kiwi', 'mango', 'peach', 'lime'
  ];

  export interface UserData {
    id: number;
    name: string;
    progress: string;
    fruit: string;
  }
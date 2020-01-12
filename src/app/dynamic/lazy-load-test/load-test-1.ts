export const loadTest1 = {
  qwerty: () => import('./test-1.module').then(m => m.Test1Module),
};

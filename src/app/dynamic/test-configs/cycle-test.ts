export const cycleTest = [
  [
    {
      id: 'cycle-test-orange',
      type: 'test-orange',
      lable: 1,
      children: [
        [
          {
            id: 'cycle-test-green',
            type: 'test-green',
            lable: 2,
            children: [
              {
                id: 'cycle-test-blue',
                type: 'test-blue',
                lable: 3,
              },
            ]
          },
        ]
      ]
    },
  ],
  [
    {
      id: 'cycle-test-green',
      type: 'test-green',
      lable: 1,
      children: [
        {
          id: 'cycle-test-blue',
          type: 'test-blue',
          lable: 2,
          children: [
            {
              id: 'cycle-test-orange',
              type: 'test-orange',
              lable: 3,
            },
          ]
        },
      ]
    },
  ],
  [
    {
      id: 'cycle-test-blue',
      type: 'test-blue',
      lable: 1,
      children: [
        {
          id: 'cycle-test-orange',
          type: 'test-orange',
          lable: 2,
          children: [
            [
              {
                id: 'cycle-test-green',
                type: 'test-green',
                lable: 3,
              },
            ]
          ]
        },
      ]
    },
  ],
];

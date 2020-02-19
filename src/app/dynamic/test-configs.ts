export const configs = [
  [
    {
      type: 'test-orange',
      lable: 1,
      children: [
        [
          {
            type: 'test-green',
            lable: 2,
          },
        ],
      ],
    },
    {
      type: 'test-orange',
      lable: 3,
      children: [
        [
          {
            type: 'test-green',
            lable: 4,
          },
        ],
      ],
    },
    {
      type: 'test-blue',
      lable: 5,
    },
  ],
  [
    {
      type: 'test-blue',
      lable: 'текст 2',
      children: [
        {
          type: 'test-orange',
          children: [
            [
              {
                type: 'test-green',
                lable: 2,
              },
              {
                type: 'test-green',
                lable: 2,
              },
            ],
            [
              {
                type: 'test-green',
                lable: 2,
              },
              {
                type: 'test-green',
                lable: 2,
              },
            ],
          ],
        },
        { type: 'test-green' },
      ],
    },
    {
      type: 'test-green',
    },
    {
      type: 'test-orange',
      children: [
        [
          {
            type: 'test-green',
          },
        ],
      ],
    },
  ],
  [
    {
      type: 'test-green',
    },
    {
      type: 'test-blue',
      lable: 'qwerty',
      children: [
        { type: 'test-orange' },
        { type: 'test-green' },
        {
          type: 'test-orange',
          children: [
            [
              {
                type: 'test-green',
              },
            ],
          ],
        },
      ],
    },
  ],
  [
    {
      type: 'test-blue',
      children: [
        { type: 'test-green', }
      ],
    },
    {
      type: 'test-blue',
      lable: 'qwerty',
      children: [
        { type: 'test-orange' },
        { type: 'test-green' },
        {
          type: 'test-orange',
          children: [
            [
              {
                type: 'test-green',
              },
            ],
          ],
        },
      ],
    },
  ],
  [
    {
      type: 'test-green',
      children: [
        { type: 'test-blue', }
      ],
    },
    {
      type: 'test-blue',
      lable: 'qwerty',
      children: [
        { type: 'test-orange' },
        { type: 'test-green' },
        {
          type: 'test-green',
        },
        {
          type: 'test-orange',
          children: [
            [

            ],
          ],
        },
      ],
    },

  ],
];
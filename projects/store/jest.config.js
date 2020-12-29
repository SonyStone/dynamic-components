module.exports = {
  name: 'store',
  preset: '<rootDir>/jest.config.js',
  coverageDirectory: '../../coverage/projects/store',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ],
};

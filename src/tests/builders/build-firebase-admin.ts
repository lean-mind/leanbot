type MockFunction = (object: any) => void;

interface MockFirebaseAdmin {
  response: any,
} 

export const buildFirebaseAdmin = ({
  response = {},
}: Partial<MockFirebaseAdmin>) => {
  const mockFunction: MockFunction = jest.fn(() => {});

  return {
    database: jest.fn((): any => ({
      ref: jest.fn(() => ({
        once: jest.fn(() => ({
          val: jest.fn(() => response),
        })),
        set: mockFunction,
        update: mockFunction,
      })),
    })),
  };
}
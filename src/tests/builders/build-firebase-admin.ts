type MockFunction = (object: any) => void;

interface MockFirebaseAdmin {
  response: any,
  set: MockFunction, 
  update: MockFunction, 
} 

export const buildFirebaseAdmin = ({
  response = {},
  set = jest.fn(() => {}),
  update = jest.fn(() => {}),
}: Partial<MockFirebaseAdmin>) => {
  return {
    database: jest.fn((): any => ({
      ref: jest.fn(() => ({
        once: jest.fn(() => ({
          val: jest.fn(() => response),
        })),
        set,
        update,
      })),
    })),
  };
}
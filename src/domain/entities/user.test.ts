import { User } from './user';

describe('User Entity', () => {
    it ("should create new User instance", () => {
        const user = new User("1", "John Doe"); 
        expect(user.getId()).toBe("1");
        expect(user.getName()).toBe("John Doe");
      });

    it("should throw an error if the name is empty", () => {
        expect(() => {
            new User("1", "");
        }).toThrow("name should not be empty");
    });
    it("should throw an error if the id is empty", () => {
        expect(() => {
            new User("", "Oliver Queen");
        }).toThrow("id should not be empty");
    });
});
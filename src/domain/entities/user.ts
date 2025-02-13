export class User {
    private readonly id: string;
    private readonly name: string;

    constructor(id: string, name: string) {
        this.validateFields(id, name); 
        this.id = id;
        this.name = name;
    }

    private validateFields(id: string, name: string): void {
        if (id === "") {
            throw new Error("id should not be empty");
        }
        if (name === "") {
            throw new Error("name should not be empty");
        }
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }
}
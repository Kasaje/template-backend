import { CustomError } from "../../utils";
import { IUser } from "./user.model";
import { UserRepository } from "./user.repository";
import bcrypt from "bcrypt";

export class UserService {
  private userRepo = new UserRepository();

  getAll = async () => {
    return (await this.userRepo.findAll()).map((user: Partial<IUser>) =>
      this.mapToIUser(user),
    );
  };

  getById = async (id: string) => {
    const user = await this.userRepo.findById(id);
    if (!user) throw new CustomError("User not found.", 400);
    return this.mapToIUser(user);
  };

  create = async (data: Partial<IUser>) => {
    const { email, password } = data;
    if (!email) throw new CustomError("Email is required.", 400);
    if (!password) throw new CustomError("Password is required.", 400);

    const passwordHash = bcrypt.hashSync(password, 12);

    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new CustomError("Email already exists", 400);
    await this.userRepo.create({ ...data, password: passwordHash });
    return;
  };

  update = async (id: string, data: Partial<IUser>) => {
    const { email, firstname, lastname, password } = data;

    // Check user before update
    const existingUser = await this.userRepo.findById(id);
    if (!existingUser) throw new CustomError("User not found.");

    // Validate email
    if (email) {
      const existingUserByEmail = await this.userRepo.findByEmail(email);

      if (existingUserByEmail && existingUser.email !== email) {
        throw new CustomError("Email already exists.", 400);
      }
    }

    const toUpdate: Partial<IUser> = {};

    if (email) toUpdate.email = email;
    if (firstname) toUpdate.firstname = firstname;
    if (lastname) toUpdate.lastname = lastname;
    if (password) toUpdate.password = bcrypt.hashSync(password, 12);

    await this.userRepo.update(id, toUpdate);
    return;
  };

  delete = async (id: string) => {
    const user = await this.userRepo.delete(id);
    if (!user) throw new CustomError("User not found.", 400);
    return;
  };

  private mapToIUser(data: Partial<IUser>) {
    return {
      id: data._id,
      email: data.email,
      firstname: data.firstname || "",
      lastname: data.lastname || "",
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

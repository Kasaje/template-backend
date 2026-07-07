import { UserModel, IUser } from "./user.model";

export class UserRepository {
  findAll = async () => {
    return UserModel.find();
  };

  findById = async (id: string) => {
    return UserModel.findById(id);
  };

  findByEmail = async (email: string) => {
    return UserModel.findOne({ email });
  };

  findByUsername = async (username: string) => {
    return UserModel.findOne({ username });
  };

  create = async (data: Partial<IUser>) => {
    return UserModel.create(data);
  };

  update = async (id: string, data: Partial<IUser>) => {
    return UserModel.findByIdAndUpdate(id, data);
  };

  delete = async (id: string) => {
    return UserModel.findByIdAndDelete(id);
  };
}

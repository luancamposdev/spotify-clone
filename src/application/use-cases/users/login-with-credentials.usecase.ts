import type {UsersRepository} from "@core/users/users.repository";
import {EmailVO} from "@core/users/value-objects/email.vo";
import {InvalidCredentialsError} from "@/errors/invalid-credentils.error";

export interface LoginWithCredentialsRequest {
  email: string;
  password: string;
}

export class LoginWithCredentialsUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(request: LoginWithCredentialsRequest) {
    const email = EmailVO.create(request.email);

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new InvalidCredentialsError();

    const ok = await user.passwordHash.verify(request.password);

    if (!ok) throw new InvalidCredentialsError();

    return {
      userId: user.id,
      role: user.role,
    };
  }
}

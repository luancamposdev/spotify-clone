import type {SocialProvider} from "@core/users/entities/users.entity";
import type {UsersRepository} from "@core/users/users.repository";

export interface LoginWithSocialRequest {
  provider: SocialProvider;
  providerId: string;
}

export class LoginWithSocialUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(request: LoginWithSocialRequest) {
    const user = await this.userRepository.findBySocialLogin(
      request.provider,
      request.providerId,
    );

    if (!user) return null;

    return { userId: user.id, role: user.role };
  }
}

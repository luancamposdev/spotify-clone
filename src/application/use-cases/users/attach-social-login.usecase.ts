import type {SocialProvider} from "@core/users/entities/users.entity";
import type {UsersRepository} from "@core/users/users.repository";

export interface AttachSocialLoginRequest {
  userId: string;
  provider: SocialProvider;
  providerId: string;
}

export class AttachSocialLoginUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(request: AttachSocialLoginRequest): Promise<void> {
    const user = await this.userRepository.findById(request.userId);

    if (!user) throw new Error("User not found");

    user.addSocialLogin({
      provider: request.provider,
      providerId: request.providerId,
    });

    await this.userRepository.save(user);
  }
}

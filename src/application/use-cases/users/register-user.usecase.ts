import {Role, UsersEntity} from "@core/users/entities/users.entity";
import type {UsersRepository} from "@core/users/users.repository";
import {AvatarUrlVO} from "@core/users/value-objects/avatar-url.vo";
import {EmailVO} from "@core/users/value-objects/email.vo";
import {NameVO} from "@core/users/value-objects/name.vo";
import {PasswordHashVO} from "@core/users/value-objects/password-hash.vo";
import {EmailAlreadyInUseError} from "@/errors/email-already-in-use.error";

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
}

export class RegisterUserUseCaseImpl {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(request: RegisterUserRequest): Promise<{ userId: string }> {
    const name = NameVO.create(request.name);
    const email = EmailVO.create(request.email);
    const avatarUrl = AvatarUrlVO.create(request.avatarUrl ?? null);
    const passwordHash = await PasswordHashVO.fromPlain(request.password);

    const exists = await this.userRepository.existsByEmail(email);

    if (exists) throw new EmailAlreadyInUseError();

    // =====================
    // aggregate creation
    // =====================
    const user = new UsersEntity({
      name,
      email,
      avatarUrl: avatarUrl,
      passwordHash,
      role: Role.LISTENER,
    });

    await this.userRepository.register(user);

    return {
      userId: user.id,
    };
  }
}

import type {AvatarUrlVO} from "@core/users/value-objects/avatar-url.vo";
import type {EmailVO} from "@core/users/value-objects/email.vo";
import type {NameVO} from "@core/users/value-objects/name.vo";
import type {PasswordHashVO} from "@core/users/value-objects/password-hash.vo";

import type {Replace} from "@/helpers/replace";

export enum Role {
  ADMIN = "ADMIN",
  LISTENER = "LISTENER",
  ARTIST = "ARTIST",
}

export type SocialProvider = "google" | "github";

export interface ISocialLogin {
  provider: SocialProvider;
  providerId: string;
}

export interface IUser {
  name: NameVO;
  email: EmailVO;
  avatarUrl: AvatarUrlVO | null;
  passwordHash: PasswordHashVO;

  role: Role;

  deletedAccountAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;

  socialLogins?: ISocialLogin[];

  artistProfile?: { id: string };
  listenerProfile?: { id: string };
}

export class UserEntity {
  private readonly _id: string;
  private props: IUser;

  constructor(
    props: Replace<IUser, { createdAt?: Date; updatedAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? Bun.randomUUIDv7();

    const createdAt = props.createdAt ?? new Date();
    const updatedAt = props.updatedAt ?? createdAt;

    this.props = {
      ...props,
      role: props.role ?? Role.LISTENER,
      createdAt,
      updatedAt,
    };

    this.assertRoleInvariants();
  }

  // =====================
  // identity
  // =====================

  public get id(): string {
    return this._id;
  }

  // =====================
  // timestamps
  // =====================

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  // =====================
  // basic props
  // =====================

  public get name(): NameVO {
    return this.props.name;
  }

  public set name(name: NameVO) {
    this.props.name = name;
    this.touch();
  }

  public get email(): EmailVO {
    return this.props.email;
  }

  public set email(email: EmailVO) {
    this.props.email = email;
    this.touch();
  }

  public get avatarUrl(): AvatarUrlVO | null {
    return this.props.avatarUrl;
  }

  public set avatarUrl(value: AvatarUrlVO | null) {
    this.props.avatarUrl = value;
    this.touch();
  }

  public get passwordHash(): PasswordHashVO {
    return this.props.passwordHash;
  }

  public set passwordHash(hash: PasswordHashVO) {
    this.props.passwordHash = hash;
    this.touch();
  }

  // =====================
  // role
  // =====================

  public get role(): Role {
    return this.props.role;
  }

  public set role(role: Role) {
    this.props.role = role;
    this.assertRoleInvariants();
    this.touch();
  }

  // =====================
  // profiles
  // =====================

  public get artistProfile(): { id: string } | undefined {
    return this.props.artistProfile;
  }

  public attachArtistProfile(profileId: string) {
    this.props.artistProfile = { id: profileId };
    this.props.role = Role.ARTIST;
    this.touch();
  }

  public get listenerProfile(): { id: string } | undefined {
    return this.props.listenerProfile;
  }

  public attachListenerProfile(profileId: string) {
    this.props.listenerProfile = { id: profileId };
    if (this.props.role !== Role.ADMIN) {
      this.props.role = Role.LISTENER;
    }
    this.touch();
  }

  // =====================
  // social login
  // =====================

  public addSocialLogin(login: ISocialLogin) {
    this.props.socialLogins = this.props.socialLogins ?? [];

    const exists = this.props.socialLogins.find(
      (l) => l.provider === login.provider && l.providerId === login.providerId,
    );

    if (!exists) {
      this.props.socialLogins.push(login);
      this.touch();
    }
  }

  public findSocialLogin(
    provider: SocialProvider,
    providerId: string,
  ): ISocialLogin | undefined {
    return (this.props.socialLogins ?? []).find(
      (login) => login.provider === provider && login.providerId === providerId,
    );
  }

  public get socialLogins(): ISocialLogin[] {
    return this.props.socialLogins ?? [];
  }

  // =====================
  // lifecycle
  // =====================

  public deleteAccount() {
    this.props.deletedAccountAt = new Date();
    this.touch();
  }

  public get deletedAccountAt(): Date | null | undefined {
    return this.props.deletedAccountAt;
  }

  public get isDeleted(): boolean {
    return !!this.props.deletedAccountAt;
  }

  private assertRoleInvariants() {
    if (this.props.role === Role.ARTIST && !this.props.artistProfile) {
      return;
    }

    if (
      this.props.role === Role.LISTENER &&
      this.props.artistProfile &&
      !this.props.listenerProfile
    ) {
      return;
    }
  }
}

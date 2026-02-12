export class GenerateAvatarUrl {
  static generateAvatarUrl(name: string): string {
    const initials = name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=#000&rounded=true`;
  }
}

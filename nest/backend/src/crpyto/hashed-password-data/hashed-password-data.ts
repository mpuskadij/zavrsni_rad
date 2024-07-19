export class HashedPasswordData {
  public Salt: string;
  public HashedPassword: string;
  constructor(salt: string, hashedPassword: string) {
    this.Salt = salt;
    this.HashedPassword = hashedPassword;
  }
}

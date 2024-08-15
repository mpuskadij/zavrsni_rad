export class JwtPayload {
  public username: string;

  public isAdmin: boolean;

  constructor(username: string, isAdmin: boolean) {
    this.username = username;
    this.isAdmin = isAdmin;
  }
}

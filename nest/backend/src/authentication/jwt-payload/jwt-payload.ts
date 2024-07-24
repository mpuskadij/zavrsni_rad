export class JwtPayload {
  public username: string;

  public isAdmin: number;

  constructor(username: string, isAdmin: number) {
    this.username = username;
    this.isAdmin = isAdmin;
  }
}

import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info) {
    // If no user is found, we proceed without throwing an error
    return user || null;
  }
}

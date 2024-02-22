import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import UserRepository from "../repositories/user.repository";
import jwt from "jsonwebtoken";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.SECRET_KEY,
  "postmessage"
);

class AuthController {
  private userRepository: UserRepository = new UserRepository();

  // Método para autenticar con Google
  public async authenticateWithGoogle(req: Request, res: Response) {
    try {
      const { token } = req.body;
      console.log(token, "token google oauth");
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      console.log(ticket, "ticket google oauth");

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res
          .status(400)
          .json({ message: "Email no proporcionado por Google" });
      }

      let user = await this.userRepository.findUserByEmail(payload.email);
      console.log(user, "user google oauth");

      if (!user) {
        user = await this.userRepository.createUserFromGoogle(
          payload.email,
          payload.name || "",
          payload.picture || ""
        );
      }

      // Generar un token para el usuario
      const userToken = this.generateToken(user);
      console.log(userToken, "userToken google oauth");

      res.json({ user, token: userToken });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al autenticar con Google", error });
    }
  }

  // Método para generar el token JWT
  private generateToken(user: any) {
    if (!process.env.SECRET_KEY) {
      throw new Error("La clave secreta no está definida");
    }
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );
  }
}

export default new AuthController();

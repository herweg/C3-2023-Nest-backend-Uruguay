// Libraries
import { Controller, Body, Post, Param, Get } from '@nestjs/common'
import { SecurityService } from 'src/business/services'
import { FireSignIn, SignInDto, SignUpDto } from 'src/business/dtos'

@Controller('security')
export class SecurityController {

    constructor(private readonly securityService: SecurityService) { }

    @Post("signup")
    signUp(@Body() signUp: SignUpDto): string {
        return this.securityService.signUp(signUp)
    }

    @Post("signin")
    signIn(@Body() signIn: SignInDto): string {
        return this.securityService.signIn(signIn)
    }

    @Post('signout/:token')
    signOut(@Param('token') token: string): void {
        this.securityService.signOut(token)
    }

    @Post('fire')
    fireCheck(@Body() email: FireSignIn): string {
        return this.securityService.signInGoogle(email.email)
    }
}
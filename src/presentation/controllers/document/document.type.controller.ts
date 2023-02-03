import { Logger, Post } from "@nestjs/common";
import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { AccountTypeEntity } from "src/data";

@Controller("document-type")
export class DocumentTypeController {

    private logger = new Logger("AccountController")

    //@Post("account-type/create")
    // createAccountType(@Body(documentTypeDTO: DocumentTypeDto)): AccountTypeEntity {
    //     const newDocumentType = 
    // }
}

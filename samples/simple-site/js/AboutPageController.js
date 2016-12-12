/**
 * Created by chad on 12/10/16.
 */

class AboutPageController extends PageController {
    constructor() {
        super();
        this.title = "Who We Are";
        this.subTitle = "Only Humble Developers";

        this.contactInfo = {
            name: "",
            email: "",
            message: ""
        };

        this.submitContactRequest = this.submitContactRequest.bind(this);
    }

    set contextElement(value) {
        super.contextElement = value;
        this.contactRequestModalRef = this.subContext.boundElement.refs.contactRequestModal;
        this.contactRequstModal = $(this.contactRequestModalRef.domElement);
        this.contactRequestErrorModalRef = this.subContext.boundElement.refs.contactRequestError;
        this.contactRequestErrorModal = $(this.contactRequestErrorModalRef.domElement);
    }


    submitContactRequest(event, dataBoundContext) {
        event.preventDefault();
        this.contactInfo = {
            name: event.srcElement.elements.contactName.value,
            email: event.srcElement.elements.contactEmail.value,
            message: event.srcElement.elements.contactMessage.value.trim()
        };

        this.contactRequestModalRef.renderWithContext(this);
        this.contactRequstModal.modal("show");
        event.srcElement.reset();
    }
}
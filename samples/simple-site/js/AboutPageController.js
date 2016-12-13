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

        this.data = AboutData;

        this.submitContactRequest = this.submitContactRequest.bind(this);
    }

    set contextElement(value) {
        super.contextElement = value;
        this.contactRequestModalRef = this.subContext.boundElement.refs.contactRequestModal;
        this.contactRequstModal = $(this.contactRequestModalRef.domElement);

        this.aboutArticle = this.subContext.boundElement.refs.aboutArticle;
        this.aboutArticle.domElement.innerHTML = this.data.text;
    }


    submitContactRequest(event, dataBoundContext) {
        event.preventDefault();
        this.contactInfo = {
            name: event.srcElement.elements.contactName.value,
            email: event.srcElement.elements.contactEmail.value,
            message: event.srcElement.elements.contactMessage.value
        };

        this.contactRequestModalRef.renderWithContext(this);
        this.contactRequstModal.modal("show");
        event.srcElement.reset();
    }
}
/**
 * Created by chad on 12/10/16.
 */

class ProjectsPageController extends PageController {
    constructor() {
        super();
        this.title = "Our Work";
        this.subTitle = "Just Keeping Busy";

        this.data = ProjectsData;

        this.selected = this.selected.bind(this);
        this.selectedClass = this.selectedClass.bind(this);
        this.selectProject = this.selectProject.bind(this);
        this.selectedProjectIndex = 0;
    }

    set contextElement(value) {
        super.contextElement = value;
    }

    selectProject(event, dataBoundContext) {
        this.selectedProjectIndex = dataBoundContext.dataBoundIndex;
        this.subContext.renderWithContext(this);
    }

    selected(dataBoundContext) {
        return dataBoundContext.dataBoundIndex === this.selectedProjectIndex;
    }

    selectedClass(dataBoundContext) {
        return this.selected(dataBoundContext) ? "selected" : "";
    }
}
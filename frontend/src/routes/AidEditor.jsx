import AidEditorForm from "../components/AidEditorForm";
import ContainerRow from "../components/ContainerRow";

function AidEditor() {
  return (
    <div className="editor-page">
      <ContainerRow type="page">
        <div className="col-md-10 offset-md-1 col-xs-12">
          <AidEditorForm />
        </div>
      </ContainerRow>
    </div>
  );
}

export default AidEditor;

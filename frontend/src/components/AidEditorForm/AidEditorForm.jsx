import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import getAid from "../../services/getAid";
import setAid from "../../services/setAid";
import getCategoriesSelect from "../../services/getCategoriesSelect";
import getSubcategoriesSelect from "../../services/getSubcategoriesSelect";
import FormFieldset from "../FormFieldset";
import { SelectButton } from 'primereact/selectbutton';
import { TreeSelect } from "primereact/treeselect";

const emptyForm = { type: null, title: "", description: "", body: "", categoryList: "" , subcategoryList: ""};
var categories = [];
var allSubcategories = null;
var subcategories = [];

getCategoriesSelect().then((res) => {categories = res.data});
getSubcategoriesSelect().then((res) => {allSubcategories = res.data});

function AidEditorForm() {
  const { state } = useLocation();
  const [{ type, title, description, body, categoryList,  subcategoryList}, setForm] = useState(
    state || emptyForm
  );
  const [errorMessage, setErrorMessage] = useState("");
  const { isAuth, headers, loggedUser } = useAuth();

  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    const redirect = () => navigate("/", { replace: true, state: null });
    if (!isAuth) return redirect();

    if (state || !slug) return;

    getAid({ headers, slug })
      .then(({ author: { username }, body, description, categoryList, subcategoryList, title, type}) => {
        if (username !== loggedUser.username) redirect();

        setForm({ body, description, categoryList, subcategoryList, title , type});
      })
      .catch(console.error);

    return () => setForm(emptyForm);
  }, [headers, isAuth, loggedUser.username, navigate, slug, state]);

  const inputHandler = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setForm((form) => ({ ...form, [key]: value }));
  };

  const categoriesInputHandler = (e) => {
    const value = e.target.value;
    subcategories = allSubcategories[value]

    setForm((form) => ({ ...form, categoryList: value.split(/,| /) }));
  };

  const subcategoriesInputHandler = (e) => {
    const value = e.target.value;

    setForm((form) => ({ ...form, subcategoryList: value.split(/,| /) }));
  };

  const formSubmit = (e) => {
    e.preventDefault();
    if (type==="") return;

    setAid({ headers, slug, body, description, categoryList, subcategoryList, title , type})
      .then((slug) => navigate(`/aid/${slug}`))
      .catch(setErrorMessage);
  };

  return (
    <form onSubmit={formSubmit}>
      <fieldset>
        <fieldset className="form-group">
          {errorMessage && <span className="error-messages">{errorMessage}</span>}
        </fieldset>
        
        <fieldset className="form-group">
          <SelectButton name="type" required value={type} onChange={inputHandler} options={['Provide', 'Request']} className={type===""?"p-invalid":""}/>
        </fieldset>

        <fieldset className="form-group">
          <TreeSelect
            filter
            placeholder="Aid Category"  
            name="categories"
            value={categoryList}
            onChange={categoriesInputHandler}
            options={categories}
            className="form-control"
            required
          />
        </fieldset>

        <fieldset className="form-group">
          <TreeSelect
            filter
            disabled={!categoryList}
            placeholder="Aid Subcategory"
            name="categories"
            value={subcategoryList}
            onChange={subcategoriesInputHandler}
            options={subcategories}
            className="form-control"
            required
          />
        </fieldset>

        <FormFieldset
          placeholder="Aid Title"
          name="title"
          required
          value={title}
          handler={inputHandler}
        ></FormFieldset>

        <FormFieldset
          normal
          placeholder="What's this aid about?"
          name="description"
          required
          value={description}
          handler={inputHandler}
        ></FormFieldset>

        <fieldset className="form-group">
          <textarea
            className="form-control"
            rows="8"
            placeholder="Write your aid (in markdown)"
            name="body"
            required
            value={body}
            onChange={inputHandler}
          ></textarea>
        </fieldset>

        {/*<FormFieldset
          normal
          placeholder="Enter categories"
          name="categories"
          value={categoryList}
          handler={categoriesInputHandler}
        >
          <div className="category-list"></div>
        </FormFieldset>*/}

        <button className="btn btn-lg pull-xs-right btn-primary" type="submit">
          {slug ? "Update Aid" : "Publish Aid"}
        </button>
      </fieldset>
    </form>
  );
}

export default AidEditorForm;

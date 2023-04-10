import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import getAid from "../../services/getAid";
import setAid from "../../services/setAid";
import getCategoriesSelect from "../../services/getCategoriesSelect";
import FormFieldset from "../FormFieldset";
import { TreeSelect } from "primereact/treeselect";

const emptyForm = { title: "", description: "", body: "", categoryList: "" };
var categories = [];
getCategoriesSelect().then((res) => {categories = res.data});

function AidEditorForm() {
  const { state } = useLocation();
  const [{ title, description, body, categoryList }, setForm] = useState(
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
      .then(({ author: { username }, body, description, categoryList, title }) => {
        if (username !== loggedUser.username) redirect();

        setForm({ body, description, categoryList, title });
      })
      .catch(console.error);

    return () => setForm(emptyForm);
  }, [headers, isAuth, loggedUser.username, navigate, slug, state]);

  const inputHandler = (e) => {
    const type = e.target.name;
    const value = e.target.value;

    setForm((form) => ({ ...form, [type]: value }));
  };

  const categoriesInputHandler = (e) => {
    const value = e.target.value;

    setForm((form) => ({ ...form, categoryList: value.split(/,| /) }));
  };

  const formSubmit = (e) => {
    e.preventDefault();

    setAid({ headers, slug, body, description, categoryList, title })
      .then((slug) => navigate(`/aid/${slug}`))
      .catch(setErrorMessage);
  };

  return (
    <form onSubmit={formSubmit}>
      <fieldset>
        {errorMessage && <span className="error-messages">{errorMessage}</span>}
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

        <fieldset className="form-group">
          <TreeSelect
            filter
            placeholder="Enter category"
            name="categories"
            value={categoryList}
            onChange={categoriesInputHandler}
            options={categories}
            //handler={categoriesInputHandler}
            className="form-control"
            //required
          />
          <div className="category-list"></div>
        </fieldset>

        <button className="btn btn-lg pull-xs-right btn-primary" type="submit">
          {slug ? "Update Aid" : "Publish Aid"}
        </button>
      </fieldset>
    </form>
  );
}

export default AidEditorForm;

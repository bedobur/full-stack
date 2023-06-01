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
import { Tooltip } from 'antd';
import TurkeyMap from 'turkey-map-react';

const emptyForm = { type: "", title: "", description: "", body: "", categoryList: "" , subcategoryList: "", location: ""};
var categories = [];
var allSubcategories = {};
var subcategories = [];
var subcategoryListDict = {};

getCategoriesSelect().then((res) => {categories = res.data});
getSubcategoriesSelect().then((res) => {allSubcategories = res.data});

function AidEditorForm() {
  const { state } = useLocation();
  const [{ type, title, description, body, categoryList,  subcategoryList, location}, setForm] = useState(
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
      .then(({ author: { username }, body, description, categoryList, subcategoryList, title, type, location}) => {
        if (username !== loggedUser.username) redirect();

        setForm({ body, description, categoryList, subcategoryList, title , type, location});
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
    subcategoryListDict = {};

    setForm((form) => ({ ...form, categoryList: value.split(/,| /) }));
  };

  const subcategoriesInputHandler = (e) => {
    const value = e.target.value;
    subcategoryListDict = value;

    setForm((form) => ({ ...form, subcategoryList: Object.keys(value)}));
  };

  const formSubmit = (e) => {
    e.preventDefault();

    if (type === "" || !subcategoryList.length || !subcategoryList.length || location === "") {
      setErrorMessage("Please fill all the fields!");
      return
    };

    setAid({ headers, slug, body, description, categoryList, subcategoryList, title , type, location})
      .then((slug) => navigate(`/aid/${slug}`))
      .catch(setErrorMessage);
  };

  const renderCity = (cityComponent, cityData) => ( 
    <Tooltip title={cityData.name} key={cityData.id}> 
        {cityComponent} 
    </Tooltip>
  );

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
            selectionMode="multiple"
            metaKeySelection={false}
            value={subcategoryListDict}
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
        
        <FormFieldset
          placeholder="Location "
          name="location"
          required
          value={location}
          readOnly={true}
        ></FormFieldset>

        <TurkeyMap cityWrapper={renderCity} onClick={ ({ name }) => setForm((form) => ({ ...form, location: name })) }/>

        <button className="btn btn-lg pull-xs-right btn-primary" type="submit">
          {slug ? "Update Aid" : "Publish Aid"}
        </button>
      </fieldset>
    </form>
  );
}

export default AidEditorForm;

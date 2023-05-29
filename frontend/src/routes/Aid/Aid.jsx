import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import AidMeta from "../../components/AidMeta";
import AidsButtons from "../../components/AidsButtons";
import AidCategories from "../../components/AidCategories";
import BannerContainer from "../../components/BannerContainer";
import { useAuth } from "../../context/AuthContext";
import getAid from "../../services/getAid";

function Aid() {
  const { state } = useLocation();
  const [aid, setAid] = useState(state || {});
  const { title, body, categoryList, createdAt, author } = aid || {};
  const { headers, isAuth } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    if (state) return;

    getAid({ slug, headers })
      .then(setAid)
      .catch((error) => {
        console.error(error);
        navigate("/not-found", { replace: true });
      });
  }, [isAuth, slug, headers, state, navigate]);

  return (
    <div className="aid-page">
      <BannerContainer>
        <h1>{title}</h1>
        <p>{aid.description}</p>
        <h5>{aid.type}</h5>
        <h5>{aid.subcategoryList.join(', ')}</h5>
        <h5>{aid.location}</h5>
        <AidMeta author={author} createdAt={createdAt}>
          <AidsButtons aid={aid} setAid={setAid} />
        </AidMeta>
      </BannerContainer>

      <div className="container page">
        <div className="row aid-content">
          <div className="col-md-12">
            {body && <Markdown options={{ forceBlock: true }}>{body}</Markdown>}
            <AidCategories categoryList={categoryList} />
          </div>
        </div>

        <hr />

        <div className="aid-actions">
          <AidMeta author={author} createdAt={createdAt}>
            <AidsButtons aid={aid} setAid={setAid} />
          </AidMeta>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default Aid;

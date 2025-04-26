import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './NotebookScreen.css';

function NotebookScreen() {
  const [articles, setArticles] = useState([]);
  const [activeArticleId, setActiveArticleId] = useState(null);
  const {id} = useParams();
  const nav = useNavigate();

  //Data from DB
  useEffect(() => {
    const fakeData = [
      { id: 1, title: "Bài viết 1", content: "Nội dung bài viết 1..." },
      { id: 2, title: "Bài viết 2", content: "Nội dung bài viết 2..." },
      { id: 3, title: "Bài viết 3", content: "Nội dung bài viết 3..." }
    ];
    setArticles(fakeData);
  }, []);

  useEffect(() =>{
    if(id){
      const numID = parseInt(id);
      const exists = articles.find(article => article.id === numID);
      if(exists){
        setActiveArticleId(numID)
      }
    }
  }, [id, articles]);

  const toggleArticle = (id) => {
    const newActive = activeArticleId === id ? null : id;
    setActiveArticleId(newActive);
    nav(`/sotay/${newActive ?? ""}`); //Update  URL
  };

  return (
    <div className="about-container">
      <div className="card-list">
        {articles.map(article => (
          <div className="article-card" key={article.id}>
            <div
              className="article-title"
              onClick={() => toggleArticle(article.id)}
            >
              {article.title}
            </div>
            {activeArticleId === article.id && (
              <div className="article-content">{article.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotebookScreen;

import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://cryptonews-api.com/api/v1", {
          params: { apikey: "TU_API_KEY_AQUÍ", category: "bitcoin" },
        });
        setNews(response.data.news);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p className="text-center">Cargando noticias...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {news.map((article, index) => (
        <div key={index} className="p-4 bg-white rounded shadow">
          <h3 className="font-bold text-lg">{article.title}</h3>
          <p>{article.source_name}</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Leer más
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsSection;

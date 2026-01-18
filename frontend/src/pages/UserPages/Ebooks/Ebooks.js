import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Ebooks.css";

import axios from "axios";
import {
  startProgress,
  stopProgress,
} from "../../../utils/NProgress/NProgress";

import EbookPageBgImage from "../../../assets/img/Ebook_bg.jpg";
import SearchBar from "../../../components/SearchBar/SearchBar";
import PagePagination from "../../../components/PagePagination/PagePagination";
import EbookGrid from "../../../components/EbookGrid/EbookGrid";
import RecipeSkeletonGrid from "../../../components/RecipeSkeletonGrid/RecipeSkeletonGrid";
import SmallLineSeparator from "../../../components/SmallLineSeparator/SmallLineSeparator";

function Ebooks() {
  const [ebookList, setEbookList] = useState([]);
  const [ebookLoading, setEbookLoading] = useState(true);
  const [ebookError, setEbookError] = useState(null);
  const [ebookFilterLoading, setEbookFilterLoading] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [limit, setLimit] = useState(16);
  const [searchQuery, setSearchQuery] = useState("");

  // Get ALL Ebooks from ebook-service
  useEffect(() => {
    const fetchEbooks = async () => {
      startProgress();
      setEbookLoading(true);
      try {
        const ebookServiceUrl = process.env.REACT_APP_EBOOK_URL;
        const res = await axios.get(`${ebookServiceUrl}`);
        console.log("Dữ liệu ebooks lấy về:", res.data);
        // Đảm bảo ebookList luôn là một mảng
        const ebooks = Array.isArray(res.data)
          ? res.data
          : res.data.ebooks && Array.isArray(res.data.ebooks)
          ? res.data.ebooks
          : [];
        setEbookList(ebooks);
      } catch (err) {
        console.error("Lỗi khi fetch danh sách sách:", err);
        setEbookError("Không thể tải danh sách sách");
        setEbookList([]); // Đặt về mảng rỗng nếu có lỗi
      } finally {
        setEbookLoading(false);
        stopProgress();
      }
    };

    fetchEbooks();
  }, []);

  // Search within ebooks list by title/author
  const handleSearch = (query) => {
    const trimmed = query.trim();
    setSearchQuery(trimmed);
    setCurrPage(1);
  };

  // Filter ebooks theo searchQuery (có thể thêm filter theo tác giả, giá, etc. sau)
  let filteredEbooks = ebookList;
  if (searchQuery) {
    const lower = searchQuery.toLowerCase();
    filteredEbooks = ebookList.filter((ebook) => {
      const title = (ebook.title || "").toLowerCase();
      const author = (ebook.author || "").toLowerCase();
      return title.includes(lower) || author.includes(lower);
    });
  }

  let totalPage = Math.ceil(filteredEbooks.length / limit);

  // Paginate the filtered ebooks based on the current page and limit per page
  let paginatedEbooks = filteredEbooks.slice(
    (currPage - 1) * limit,
    currPage * limit
  );

  // handle page change
  function handlePageChange(value) {
    console.log(currPage);
    if (value === "<<") {
      setCurrPage(1);
    } else if (value === "<") {
      if (currPage !== 1) {
        setCurrPage(currPage - 1);
      }
    } else if (value === ">") {
      if (currPage !== totalPage) {
        setCurrPage(currPage + 1);
      }
    } else if (value === ">>") {
      setCurrPage(totalPage);
    } else if (value === " ..." || value === "... ") {
      setCurrPage(currPage);
    } else {
      setCurrPage(value);
    }
  }

  return (
    <div className="ebooks">
      <div className="ebooks-background">
        <img src={EbookPageBgImage} alt="Ebooks page background" />
      </div>

      <div className="ebooks-body-wrapper">
        <div className="title">
          <h1>Sách nấu ăn & Công thức</h1>
          <p>
            Khám phá bộ sưu tập sách nấu ăn đầy đủ với những công thức tuyệt vời,
            mẹo nấu ăn chuyên nghiệp và hướng dẫn chi tiết để nâng cao kỹ năng nấu ăn của bạn.
          </p>
        </div>
        <SearchBar onSearch={handleSearch} />

        <SmallLineSeparator />

        {ebookLoading || ebookFilterLoading ? (
          <>
            <p className="ebook-loading">Đang tải sách...</p>
            <RecipeSkeletonGrid number={8} />
          </>
        ) : ebookError ? (
          <p>{ebookError}</p>
        ) : (
          <EbookGrid ebookList={paginatedEbooks} />
        )}

        <PagePagination
          totalPage={totalPage}
          currPage={currPage}
          limit={limit}
          siblings={1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Ebooks;


import * as React from "react";
import { AxiosError } from "axios";
import { Button, Space, Typography, Input } from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import Block from "../components/common/Block";
import TaskList from "../components/news/NewsList";
import { useAuth } from "../utils/auth";
import { newsList } from "../api/news";
import NewsList from "../components/news/NewsList";

const { Title } = Typography;

const NewsListPage: React.FC = () => {
  const nagivate = useNavigate();
  const [, setToken] = useAuth();

  const [searchKey, setSearchKey] = React.useState<string>("");
  const [pageSize, setPageSize] = React.useState<number>(15);
  const [page, setPage] = React.useState<number>(1);

  const { data, isLoading, isSuccess, error, refetch } = useQuery<
    Promise<any>,
    AxiosError,
    API.CommonResp<API.NewsListResp>,
    any
  >({
    queryKey: ["news"],
    queryFn: () => newsList(searchKey),
  });

  const handlePaginateChange = (pageNo: number, pageS: number) => {
    setPage(pageNo);
  };

  React.useEffect(() => {
    if (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authtoken");
        setToken("");
      }
    }
  }, [error]);

  React.useEffect(() => {
    refetch();
  }, [page, pageSize, searchKey]);

  const handleSearch = (value: string) => {
    setSearchKey(value);
  };

  return (
    <Block>
      <div style={{ textAlign: "center", margin: "15px 0" }}>
        <Title level={2}>NEWS LIST</Title>
        <Space>
          <Button type="primary" onClick={() => nagivate("tasks/new")}>
            New Task
          </Button>
        </Space>
        <hr />
        <Input.Search
          placeholder="input search text"
          onSearch={handleSearch}
          style={{ width: "100%" }}
        />
      </div>
      <NewsList
        pending={isLoading}
        articles={isSuccess ? data.data.articles : []}
        total={data?.data.totalResults}
        onPaginateChange={handlePaginateChange}
      />
    </Block>
  );
};

export default NewsListPage;

import { DeleteArticle, makeDeleteArticle } from "@/article/application/useCases/DeleteArticle";
import { Article } from "@/article/domain/Article";
import { ArticleRepository } from "@/article/domain/ArticleRepository";
import { NotFoundError } from "@/_lib/exceptions/NotFoundError";

describe("DeleteArticle", () => {
  const id = "mock-article-id";
  const title = "Title";
  const content = "Some content";

  const articleRepository: ArticleRepository = {
    findById: jest.fn().mockImplementation(async (articleId) => {
      if (articleId !== id) {
        throw new NotFoundError();
      }

      return Article.create({
        id: { value: id },
        title,
        content,
      });
    }),
    store: jest.fn(),
    getNextId: jest.fn(),
  };

  let deleteArticle: DeleteArticle;

  beforeEach(async () => {
    jest.clearAllMocks();
    deleteArticle = makeDeleteArticle({ articleRepository });
  });

  it("should save the article as deleted", async () => {
    await deleteArticle(id);

    expect(articleRepository.store).toHaveBeenCalledWith(
      expect.objectContaining({
        id: { value: id },
        state: "DELETED",
      })
    );
  });

  it("should throw error if not found", async () => {
    await expect(deleteArticle("some-wrong-id")).rejects.toThrowError(NotFoundError);
  });
});

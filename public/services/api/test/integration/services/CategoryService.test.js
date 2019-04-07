var expect = require("expect");

const catData = {
  name: "Dummy Category for CategoryService Test",
  description: "Dummy category"
};
const newName = "Dummy category new name for CategoryService Test";
let cat, cat1;

describe(`#Category`, async () => {
  describe(`#CategoryService`, async () => {
    await it(`upsert: add category '${catData.name}'`, async () => {
      cat = await CategoryService.upsert(catData);
      expect(cat).toBeTruthy();
      expect(cat.name).toBe(catData.name);
    });
  });
  describe(`#CategoryService`, async () => {
    await it(`upsert: change category name '${newName}'`, async () => {
      cat1 = await CategoryService.upsert({ ...cat, name: newName });
      expect(cat1).toBeTruthy();
      expect(cat1.name).toBe(newName);
      expect(cat1.id).toBe(cat.id);
    });
  });
  describe("#CategoryService", async () => {
    await it(`allCategoriesWithProductsExcept: should return at least 1 category, last cat should has id equal to 'CustomCat'`, async () => {
      const defaultCategory = await CategoryService.defaultCategory();
      cats = await CategoryService.allCategoriesWithProductsExcept();
      expect(cats.length).toBeGreaterThan(0);
      const last = cats[cats.length - 1];
      expect(last.id).toBe(defaultCategory.id);
    });
  });
  describe("#CategoryService", async () => {
    await it(`detail: should return { name: ${newName}, ... }`, async () => {
      cat = await CategoryService.detail(cat1.id);
      expect(cat).toBeTruthy();
      expect(cat.id).toBe(cat1.id);
      expect(cat.name).toBe(cat1.name);
    });
  });
  describe("#CategoryService", async () => {
    await it(`remove: should return { name: ${newName}, ... }`, async () => {
      cat = await CategoryService.remove(cat.id);
      expect(cat).toBeTruthy();
      expect(cat1).toBeTruthy();
      expect(cat.id).toBe(cat1.id);
      expect(cat.name).toBe(cat1.name);
    });
  });
});

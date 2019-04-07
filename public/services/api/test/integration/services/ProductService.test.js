const expect = require("expect");

const catData = {
  name: "Dummy Category for ProductService Test",
  description: "Dummy category"
};
let cat, cat1;

const b1Data = {
  atomic: true,
  name: "Dummy Bot 1 for ProductService Test",
  description: "Dummy bot 1 description",
  executor: { script: "dummy_exe1", type: "tagui" },
  parameters: [
    { name: "Bot1's Param1", value: "Bot1's Param1's default value" }
  ]
};
const b2Data = {
  atomic: true,
  name: "Dummy Bot 2 for ProductService Test",
  description: "Dummy bot 2 description",
  executor: { script: "dummy_exe2", type: "tagui" },
  parameters: [
    { name: "Bot2's Param1", value: "Bot2's Param1's default value" }
  ]
};
const pData = {
  name: "Dummy Product for ProductService Test",
  description: "Dummy product description",
  parameters: [
    { name: "Product's Param1", value: "Product's Param1's default value" },
    { name: "Product's Param2", value: "Product's Param2's default value" }
  ]
};
const value = `Product param1 new value`;

let bot1, bot2, product;
let bot1Params, bot2Params, productParams;
let node1, node1Params, node1Outputs, node2, node2Params;

describe(`#Category & Product`, async () => {
  describe(`#CategoryService`, async () => {
    await it(`upsert`, async () => {
      cat = await CategoryService.upsert(catData);
      expect(cat).toBeTruthy();
      expect(cat.name).toBe(catData.name);
    });
  });
  describe(`#ProductService`, async () => {
    await it(`upsert, upsertAtomic`, async () => {
      bot1 = await ProductService.upsertAtomic({ ...b1Data, category: cat.id });
      expect(bot1).toBeTruthy();
      expect(bot1.name).toBe(b1Data.name);
      expect(bot1.atomic).toBe(true);
      expect(bot1.parameters.length).toBe(1);
      bot2 = await ProductService.upsertAtomic({ ...b2Data, category: cat.id });
      expect(bot2).toBeTruthy();
      expect(bot2.name).toBe(b2Data.name);
      expect(bot2.atomic).toBe(true);
      expect(bot2.parameters.length).toBe(1);
      const data = {
        ...pData,
        nodeDataArray: [
          { product: bot1.id, key: -1, loc: "0 0" },
          { product: bot2.id, key: -2, loc: "100 100" }
        ],
        linkDataArray: [{ from: -1, to: -2 }]
      };
      product = await ProductService.upsert(data);
      expect(product).toBeTruthy();
      expect(product.name).toBe(pData.name);
      expect(product.atomic).toBe(false);
      expect(product.parameters.length).toBe(2);
      expect(product.nodeDataArray.length).toBe(2);
      expect(product.linkDataArray.length).toBe(1);
      node1 = product.nodeDataArray.find(o => o.product == bot1.id);
      node2 = product.nodeDataArray.find(o => o.product == bot2.id);
    });
  });
  describe(`#ProductParameterService`, async () => {
    await it(`list`, async () => {
      bot1Params = await ProductParameterService.list(bot1.id);
      bot2Params = await ProductParameterService.list(bot2.id);
      productParams = await ProductParameterService.list(product.id);
      expect(bot1Params.length).toBe(1);
      expect(bot1Params.length).toBe(1);
      expect(productParams.length).toBe(2);
      expect(product.nodeDataArray.length).toBe(2);
    });
  });
  describe(`#ProductNodeParameterValueService`, async () => {
    await it(`saveValues`, async () => {
      node1Params = await ProductNodeParameterValueService.saveValues(
        node1.id,
        [{ parameter: bot1Params[0].id, value }]
      );
      expect(node1Params.length).toBe(1);
      expect(node1Params[0].value).toBe(value);
      node2Params = await ProductNodeParameterValueService.saveValues(
        node2.id,
        [{ parameter: bot2Params[0].id, valueRef: productParams[1].id }]
      );
      expect(node2Params.length).toBe(1);
      expect(node2Params[0].value).toBe(productParams[1].value);
    });
  });
  describe(`#ProductNodeOutputService`, async () => {
    await it(`save`, async () => {
      node1Outputs = await ProductNodeOutputService.save(node1.id, [
        { param: productParams[0].id, value },
        { param: productParams[1].id, valueRef: bot1Params[0].id },
        { param: productParams[1].id, value, valueRef: bot1Params[0].id }
      ]);
      expect(node1Outputs).toBeInstanceOf(Array);
      expect(node1Outputs.length).toBe(3);
    });
  });
  describe(`#ProductService`, async () => {
    await it(`remove`, async () => {
      await ProductService.remove(product.id);
      const deleted = await ProductService.remove(bot1.id);
      expect(deleted.id).toBe(bot1.id);
      await ProductService.remove(bot2.id);
    });
  });
  describe(`#CategoryService`, async () => {
    await it(`remove`, async () => {
      cat1 = await CategoryService.remove(cat.id);
      expect(cat1).toBeTruthy();
      expect(cat1.id).toBe(cat.id);
      expect(cat1.name).toBe(cat.name);
    });
  });
});

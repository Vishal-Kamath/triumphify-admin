import { FC, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateProductType } from "./create-product-form-schema";
import { useAttributes } from "@/lib/attributes";
import { Plus, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ProductVariationsFormComponent: FC<{
  form: UseFormReturn<CreateProductType>;
}> = ({ form }) => {
  const { toast } = useToast();
  const { data: attributes } = useAttributes();

  const [selectedVariationIndex, setSelectedVariationIndex] = useState(-1);

  const [attributesCombination, setAttributesCombination] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);

  const variations = form.watch("variations");

  const handleSelect = (parent: string, value: string) => {
    setAttributesCombination((prevState) => ({
      ...prevState,
      [parent]: value,
    }));
  };

  const handleDelete = (parent: string) => {
    setAttributesCombination((prevState) => {
      const newState = { ...prevState };
      delete newState[parent];
      return newState;
    });
  };

  const attributesCombinationKeys = Object.keys(attributesCombination).sort();
  const attributesCombinationValues = attributesCombinationKeys.map(
    (key) => attributesCombination[key],
  );

  const handleAdd = () => {
    if (!attributesCombinationValues.join("").trim()) {
      toast({
        title: "Fill all details!",
        description: "Select attributes to create a variation",
        variant: "warning",
      });
      return;
    }

    const key = attributesCombinationKeys
      .map((key, index) => `${key}:${attributesCombinationValues[index]}`)
      .join(" - ");
    const findVariant = variations.find((variant) => variant.key === key);
    if (findVariant) {
      toast({
        title: "Variation exists!!",
        description: `Variation "${attributesCombinationValues.join(" - ")}" already exists`,
        variant: "warning",
      });
      return;
    }

    const newVariation: CreateProductType["variations"][0] = {
      id: "",
      key,
      combinations: attributesCombination,
      discount,
      price,
      quantity,
    };

    variations.push(newVariation);
    form.setValue("variations", Array.from(variations));

    setDiscount(0);
    setPrice(0);
    setQuantity(0);
    setAttributesCombination({});
  };

  const handleDeleteVariant = (variantKey: string) => {
    const newVariations = variations.filter(
      (variation) => variation.key !== variantKey,
    );
    form.setValue("variations", newVariations);
  };

  const handleSelectForExisting = (parent: string, value: string) => {
    const getCombination = variations[selectedVariationIndex].combinations;
    const newCombination = {
      ...getCombination,
      [parent]: value,
    };
    variations[selectedVariationIndex].combinations = newCombination;

    const keysForNew = Object.keys(newCombination).sort();
    const newKey = keysForNew
      .map((key) => `${key}:${newCombination[key]}`)
      .join(" - ");
    variations[selectedVariationIndex].key = newKey;

    form.setValue("variations", Array.from(variations));
  };

  const handleDeleteForExisting = (parent: string) => {
    const newCombination = variations[selectedVariationIndex].combinations;
    delete newCombination[parent];

    const keysForNew = Object.keys(newCombination).sort();

    if (!keysForNew.length) {
      form.setValue(
        "variations",
        variations.filter((_, ind) => ind !== selectedVariationIndex),
      );
      setSelectedVariationIndex(-1);
      return;
    }

    const newKey = keysForNew
      .map((key) => `${key}:${newCombination[key]}`)
      .join(" - ");
    variations[selectedVariationIndex].key = newKey;
    variations[selectedVariationIndex].combinations = newCombination;

    form.setValue("variations", Array.from(variations));
  };

  const handleVariantOnChange = (
    variantKey: string,
    param: "quantity" | "discount" | "price",
    value: number,
  ) => {
    const findVariant = variations.find(
      (variant) => variant.key === variantKey,
    );
    if (!findVariant) return;
    findVariant[param] = value;

    form.setValue("variations", Array.from(variations));
  };

  return attributes && Array.isArray(attributes) ? (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-lg font-medium">Product Attributes</h2>
        <p className="text-xs text-slate-500">
          Generate different variations of attributes
        </p>
      </div>

      {attributes.length ? (
        <table className="border-collapse select-none overflow-x-auto border-1 max-md:block [&>*>*>*]:border-1 [&>*>*]:border-1 [&>*]:border-1">
          <tbody>
            {attributes.map((attribute, index) => (
              <tr key={attribute.id + index}>
                <td className="min-w-44 px-3 py-2">
                  <div className="flex items-center gap-3">
                    {attribute.name}
                    <X
                      className="ml-auto cursor-pointer rounded bg-slate-50 p-1 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() =>
                        selectedVariationIndex === -1
                          ? handleDelete(attribute.name)
                          : handleDeleteForExisting(attribute.name)
                      }
                    />
                  </div>
                </td>
                <td className="w-full min-w-[30rem]">
                  <div className="flex h-full w-full flex-wrap gap-6 px-3">
                    {attribute.values.length
                      ? attribute.values.map((value, index) => {
                          const selected =
                            selectedVariationIndex === -1
                              ? attributesCombination[attribute.name] ===
                                value.name
                              : variations[selectedVariationIndex].combinations[
                                  attribute.name
                                ] === value.name;
                          return (
                            <div
                              key={value.id + index}
                              className="flex items-center gap-3"
                            >
                              <input
                                type="radio"
                                id={value.id}
                                name={attribute.name}
                                checked={selected}
                                onChange={() =>
                                  selectedVariationIndex === -1
                                    ? handleSelect(attribute.name, value.name)
                                    : handleSelectForExisting(
                                        attribute.name,
                                        value.name,
                                      )
                                }
                                className="h-4 w-4 cursor-pointer accent-blue-600"
                              />
                              <label
                                htmlFor={value.id}
                                className="cursor-pointer"
                              >
                                {value.name}
                              </label>
                            </div>
                          );
                        })
                      : "No attributes available"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <table className="border-collapse select-none overflow-x-auto border-1 text-sm max-lg:block [&>*>*>*]:border-1 [&>*>*]:border-1 [&>*]:border-1">
        <thead className="font-medium">
          <tr>
            <th className="p-3"></th>
            <th className="p-3 text-left">Combination</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Discount (%)</th>
            <th className="p-3">Price (&#36;)</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {variations.map((variation, index) => {
            const attrKeys = Object.keys(variation.combinations).sort();
            const attrValues = attrKeys.map(
              (key) => variation.combinations[key],
            );

            return (
              <tr
                key={variation.key + index}
                onFocus={() => setSelectedVariationIndex(index)}
              >
                <td>
                  <div className="flex items-center justify-center">
                    <input
                      type="radio"
                      checked={index === selectedVariationIndex}
                      className="h-5 w-5"
                      onChange={() => setSelectedVariationIndex(index)}
                    />
                  </div>
                </td>
                <td className="min-w-28 break-words p-3">
                  {attrValues.join(" - ")}
                </td>
                <td>
                  <div className="max-lg:min-w-[15rem]">
                    <input
                      type="number"
                      className="h-full w-full border-none text-center outline-none"
                      value={variation.quantity.toString()}
                      onChange={(e) =>
                        handleVariantOnChange(
                          variation.key,
                          "quantity",
                          parseFloat(e.target.value.toString()) || 0,
                        )
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="max-lg:min-w-[15rem]">
                    <input
                      type="number"
                      className="h-full w-full border-none text-center outline-none"
                      value={variation.discount.toString()}
                      onChange={(e) =>
                        handleVariantOnChange(
                          variation.key,
                          "discount",
                          parseFloat(e.target.value.toString()) || 0,
                        )
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="max-lg:min-w-[15rem]">
                    <input
                      type="number"
                      className="h-full w-full border-none text-center outline-none"
                      value={variation.price.toString()}
                      onChange={(e) =>
                        handleVariantOnChange(
                          variation.key,
                          "price",
                          parseFloat(e.target.value.toString()) || 0,
                        )
                      }
                    />
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(variation.key)}
                      className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-slate-500 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          <tr onFocus={() => setSelectedVariationIndex(-1)}>
            <td>
              <div className="flex items-center justify-center">
                <input
                  type="radio"
                  checked={selectedVariationIndex === -1}
                  className="h-5 w-5"
                  onChange={() => setSelectedVariationIndex(-1)}
                />
              </div>
            </td>
            <td className="min-w-28 break-words p-3">
              {attributesCombinationValues.join(" - ")}
            </td>
            <td className="p-3">
              <div className="max-lg:min-w-[15rem]">
                <input
                  type="number"
                  className="h-full w-full border-none text-center outline-none"
                  value={quantity.toString()}
                  onChange={(e) =>
                    setQuantity(parseFloat(e.target.value.toString()) || 0)
                  }
                />
              </div>
            </td>
            <td className="p-3">
              <div className="max-lg:min-w-[15rem]">
                <input
                  type="number"
                  className="h-full w-full border-none text-center outline-none"
                  value={discount.toString()}
                  onChange={(e) =>
                    setDiscount(parseFloat(e.target.value.toString()) || 0)
                  }
                />
              </div>
            </td>
            <td className="p-3">
              <div className="max-lg:min-w-[15rem]">
                <input
                  type="number"
                  className="h-full w-full border-none text-center outline-none"
                  value={price.toString()}
                  onChange={(e) =>
                    setPrice(parseFloat(e.target.value.toString()) || 0)
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-slate-500 hover:bg-sky-100 hover:text-sky-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <div>Attributes not found</div>
  );
};

export default ProductVariationsFormComponent;

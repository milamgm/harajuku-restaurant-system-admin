import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { setDoc, doc } from "firebase/firestore";
import db from "../firebase/firebaseConfig";

interface ImportProductsProps {
  importProductsBtn: boolean;
  setImportProductsBtn: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImportProducts = ({
  importProductsBtn,
  setImportProductsBtn,
}: ImportProductsProps) => {
  const [file, setFile] = useState<File>();

  const handleChange = (e: React.ComponentProps<typeof FormControl>) => {
    const target = e.target as HTMLInputElement;
    setFile(target.files![0]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Checks if the file extension is csv
    if (file) {
      const fileExt = file.name.slice(-3);
      if (fileExt === "csv") {
        const fileReader: FileReader = new FileReader();
        fileReader.readAsText(file);
        console.log(fileReader);
        fileReader.onload = () => {
          importFile(fileReader.result, fileExt);
        };
        fileReader.onerror = () => {
          console.error(fileReader.error);
          toast.error("Error, please try again.");
        };
      } else {
        toast.error("Fille not allowed. Must be a CSV file.");
      }
    } else {
      toast.error("No files selected");
    }
  };
  //Changes the first letter of the words in the string to uppercase
  const toUpperCaseString = (str: string) => {
    let upperStr;
    if (str.indexOf(" ")) {
      const categoryArr = str.split(" ");
      let arr = [];
      for (const word of categoryArr) {
        const first = word.charAt(0).toUpperCase();
        const upperWord = `${first}${word.slice(1)}`;
        arr.push(upperWord);
      }
      upperStr = arr.join(" ");
    } else {
      const first = str.charAt(0).toUpperCase();
      upperStr = `${first}${str.slice(1)}`;
    }
    return upperStr;
  };
  //Saves the data of the uploaded file in the database
  const addToDB = async (product: string[]) => {
    const upperCasedName = toUpperCaseString(product[1]);
    const upperCasedCategory = toUpperCaseString(product[4]);
    await setDoc(doc(db, "products", product[0]), {
      product_id: product[0],
      product_img: product[5],
      product_name: upperCasedName,
      product_price: Number(product[2]),
      product_description: product[3],
      product_category: upperCasedCategory,
      product_isAvailable: true,
    });
    await setDoc(doc(db, "categories", upperCasedCategory), {
      category_name: upperCasedCategory,
    });
    toast.success("Product(s) successfully imported");
    setImportProductsBtn(false);
  };
//Collects the information from the csv file in an array to add it to the database
  const importFile = (
    fileText: string | ArrayBuffer | null,
    fileExt: string
  ) => {
    let fileArray =
      typeof fileText === "string" ? fileText.split(/\r?\n|\r/) : [""];
    fileArray = fileArray.filter((value) => value !== "");
    for (let i = 1; i < fileArray.length; i++) {
      const product = fileArray[i].split(";");
      try {
        addToDB(product);
      } catch (error) {
        console.error(error);
        toast.error("Could not connect, please try again");
      }
    }
  };
  return (
    <>
      <Modal
        show={importProductsBtn}
        fullscreen={true}
        onHide={() => setImportProductsBtn(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Import Products</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <div className="modal-in">
            <Form onSubmit={handleSubmit}>
              <h5>Import products from a CSV or tab-delimited TXT file.</h5>
              <Form.Group
                className="mb-3 input-group-sm"
                controlId="importFile"
              >
                <Form.Label>Choose File</Form.Label>
                <Form.Control
                  name="importFile"
                  type="file"
                  multiple={false}
                  onChange={(e) => handleChange(e)}
                />
              </Form.Group>
              <Button className="btn-primary" type="submit">
                Continue
              </Button>
            </Form>
          </div>
        </Modal.Body>
        <Toaster position="top-center" reverseOrder={false} />
      </Modal>
    </>
  );
};

export default ImportProducts;

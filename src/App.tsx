import "./App.css";
import WordList from "./WordList";
import { ComponentType, Fragment, lazy, useEffect, useState } from "react";
import WordGenerator from "./generator";
import RangeSlider from "./RangeSlider";
import { Button, FormLabel } from "@mui/material";
import {
  Stack,
  Box,
  Grid,
  Select,
  Option,
  Input,
  FormControl,
  Typography,
  Textarea,
} from "@mui/joy";
import Tooltip from "./Tooltip";
import InfoIcon from "@mui/icons-material/Info";

type Language = string[];
type Languages = {
  [key: string]: Language;
};

export default function App() {
  const [generatedWords, setGeneratedWords] = useState(null);
  const [prefix, setPrefix] = useState("");
  const [order, setOrder] = useState(3);
  const [minimumLength, setMinimumLength] = useState(5);
  const [maximumLength, setMaximumLength] = useState(8);
  const [numberOfWords, setNumberOfWords] = useState(50);
  const [language, setLanguage] = useState("");
  const [languages, setLanguages] = useState<Languages>({});
  const [custom, setCustom] = useState("");

  async function importLanguage(language: string): Promise<Language> {
    const lang = await import(`./languages/${language}.json`);
    return lang.default;
  }

  async function loadDefaultLanguages(): Promise<void> {
    try {
      const english = await importLanguage("english");
      const french_pokemon = await importLanguage("french_pokemon");
      const langs = {
        English: english,
        "French Pokémon": french_pokemon,
        Custom: [],
      };

      setLanguages(langs);
      setLanguage("English");
    } catch (e) {
      console.error("Error loading languages");
      console.error(e);
    }
  }

  useEffect(() => {
    loadDefaultLanguages();
  }, []);

  function loadCustomLanguage() {
    const words = custom.split(/[ \n\t]+/);
    const langs = languages;
    langs["Custom"] = words;
    setLanguages(langs);
  }

  function generateWords() {
    if (language === "Custom") {
      loadCustomLanguage();
    }
    console.log(language);

    const words = languages[language];
    console.log(words);
    const gen = new WordGenerator(order, words);

    var wordList = [];
    for (let i = 0; i < numberOfWords; i++) {
      const word = gen.generateWord(prefix, minimumLength, maximumLength);
      wordList.push(word);
    }

    setGeneratedWords(wordList);
  }

  function handleChangeLanguage(language: string): void {
    setLanguage(language);
    console.log(language);
  }

  function onClear(): void {
    setGeneratedWords([]);
  }

  return (
    <>
      <Stack direction="column" spacing={2}>
        <Typography level="h1">Weird Word Generator</Typography>
        <Typography level="h3">
          Create new, playful words from your list of favorites.
        </Typography>
      </Stack>
      <Stack direction="row" spacing={4} sx={{ py: 4 }}>
        <Typography level="body-md" sx={{ textAlign: "justify" }}>
          <Typography color="primary">Weird Word Weaver</Typography> is a simple
          yet engaging app designed for those who enjoy wordplay and creative
          writing. With its straightforward interface, the app turns a list of
          words into a source of inspiration, generating new and interesting
          words. It's particularly useful for anyone looking to add a unique
          twist to their writing, create novel names for characters or projects,
          or just have fun exploring new linguistic combinations.
        </Typography>
        <Typography level="body-md" sx={{ textAlign: "justify" }}>
          The magic of{" "}
          <Typography color="primary">Weird Word Weaver</Typography> lies in its
          use of Markov chains, where the
          <Typography color="success" variant="soft">
            order
          </Typography>{" "}
          of the chain is a key feature. This{" "}
          <Typography color="success" variant="soft">
            order
          </Typography>{" "}
          determines how many of the last letters in a word the app considers
          when predicting the next letter. For instance, with an order of 2, the
          app analyzes the last two letters and uses the patterns in your input
          words to decide the subsequent letter. This balance of randomness and
          pattern-based structure makes{" "}
          <Typography color="primary">Weird Word Weaver</Typography> a
          fascinating tool for those interested in the playful side of language.
        </Typography>
      </Stack>
      <div className="">
        <div className="">
          <Grid container spacing={2}>
            <Grid sm={12}>
              <FormControl>
                <Tooltip
                  placement="top"
                  title="Adjust the slider to set the minimum and maximum length for the generated words."
                  color="primary"
                >
                  <FormLabel>Word Length Range</FormLabel>
                </Tooltip>
                <RangeSlider
                  bot={1}
                  top={10}
                  min={minimumLength}
                  max={maximumLength}
                  setMin={setMinimumLength}
                  setMax={setMaximumLength}
                />
              </FormControl>
            </Grid>
            <Grid sm={4}>
              <FormControl>
                <Tooltip
                  placement="top"
                  title="Enter the number of new words you'd like to create."
                  color="primary"
                >
                  <FormLabel>Number of Words to Generate</FormLabel>
                </Tooltip>
                <Input
                  type="number"
                  onChange={(e) =>
                    setNumberOfWords(parseInt(e.target.value, 10))
                  }
                  value={numberOfWords}
                  variant="soft"
                  color="primary"
                />
              </FormControl>
            </Grid>
            <Grid sm={6}>
              <FormControl>
                <Tooltip
                  placement="top"
                  title="Specify a beginning sequence for the generated words; the app will use this prefix as a starting point."
                  color="primary"
                >
                  <FormLabel>Word Prefix</FormLabel>
                </Tooltip>
                <Input
                  color="primary"
                  variant="soft"
                  onChange={(e) => setPrefix(e.target.value)}
                  value={prefix}
                />
              </FormControl>
            </Grid>
            <Grid sm={4}>
              <FormControl>
                <Tooltip
                  placement="top"
                  title="Choose an order of 2 or 3 for a good balance. Higher values might result in generating words identical to the supplied ones, while an order of 1 can lead to very random outcomes."
                  color="primary"
                >
                  <FormLabel>Markov Chain Order</FormLabel>
                </Tooltip>
                <Input
                  type="number"
                  variant="soft"
                  color="primary"
                  onChange={(e) => setOrder(parseInt(e.target.value, 10))}
                  value={order}
                />
              </FormControl>
            </Grid>
            <Grid sm={6}>
              <FormControl>
                <Tooltip
                  placement="top"
                  title="Choose your word list: select 'English' for a diverse set of 10,000 words, 'French Pokémon' for 1025 pokémon names in French, or 'Custom' to use your own list."
                  color="primary"
                >
                  <FormLabel>Language Selection</FormLabel>
                </Tooltip>
                <Select
                  color="primary"
                  placeholder="Choose a language"
                  variant="soft"
                  defaultValue="English"
                  onChange={(_, v) => handleChangeLanguage(v)}
                >
                  {Object.keys(languages).map((lang) => (
                    <Option key={lang} value={lang}>
                      {lang}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ pt: 2 }}>
            {language === "Custom" ? (
              <FormControl>
                <FormLabel>
                  <Tooltip
                    placement="top"
                    title="Enter your own list of words, separated by spaces or line breaks."
                    color="primary"
                  >
                    <Box>Custom Word List</Box>
                  </Tooltip>
                </FormLabel>
                <Textarea
                  onChange={(e) => setCustom(e.target.value)}
                  minRows={10}
                  variant="soft"
                />
                ;
              </FormControl>
            ) : (
              <></>
            )}
          </Box>
          <Box sx={{ py: 2 }}>
            <Button variant="contained" color="primary" onClick={generateWords}>
              Generate
            </Button>
          </Box>
        </div>
      </div>
      <Box>
        {generatedWords ? <WordList wordList={generatedWords} /> : <></>}
      </Box>
    </>
  );
}

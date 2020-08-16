import React from "react";
import PropTypes from "prop-types";
import { getChefBio } from "../../lib/chef";
import css from "./RecipeBio.module.css";

const RecipeBio = ({ author }) => (
  <div className={css.bio}>
    <figure>
      <img src={author.avatar} />
    </figure>
    <div>
      <h3>About {author.name}</h3>
      <p>{getChefBio(author)}</p>
    </div>
  </div>
);

RecipeBio.propTypes = {
  author: PropTypes.object,
};

export default RecipeBio;

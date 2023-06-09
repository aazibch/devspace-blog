import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req, res) {
  let posts;

  if (process.env.NODE_ENV === 'production') {
    // @todo - fetch from cache
  } else {
    const files = fs.readdirSync(path.join('posts'));

    posts = files.map((fileName) => {
      const markdownWithMeta = fs.readFileSync(
        path.join('posts', fileName),
        'utf-8'
      );

      const { data: frontMatter } = matter(markdownWithMeta);

      return {
        frontMatter
      };
    });
  }

  console.log({ posts });

  const results = posts.filter(
    ({ frontMatter: { title, excerpt, category }, content }) =>
      title.toLowerCase().indexOf(req.query.q) !== -1 ||
      excerpt.toLowerCase().indexOf(req.query.q) !== -1 ||
      category.toLowerCase().indexOf(req.query.q) !== -1
  );

  console.log(results);

  res.status(200).json({ results });
}

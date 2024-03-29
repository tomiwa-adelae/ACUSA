// Server
// const server = "http://localhost:5000";
const server = "https://acusamediabackend.onrender.com";

// Selectors
const nav = document.querySelector(".links");
const hamburgerMenu = document.querySelector(".burger");

// Events to trigger the nav bar being opened
hamburgerMenu.addEventListener("click", (e) => {
	// Make the Nav links display
	nav.classList.toggle("links-open");

	// Toggle the hamburger menu to a close icon
	hamburgerMenu.classList.toggle("fa-times");
});

// Typewriter effect on the Home page showcase
class Typewriter {
	constructor(txtElement, words, wait = 3000) {
		this.txtElement = txtElement;
		this.words = words;
		this.txt = "";
		this.wordIndex = 0;
		this.wait = parseInt(wait, 10);
		this.type();
		this.isDeleting = false;
	}

	type() {
		// Current Index of words
		const current = this.wordIndex % this.words.length;

		// Get full text of the word
		const fullTxt = this.words[current];

		// Check if delecting
		if (this.isDeleting) {
			// Remove a character
			this.txt = fullTxt.substring(0, this.txt.length - 1);
		} else {
			// Add a character
			this.txt = fullTxt.substring(0, this.txt.length + 1);
		}

		// Insert txt into Element
		this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

		// Initial Type speed
		let typeSpeed = 300;

		if (this.isDeleting) {
			typeSpeed /= 2;
		}

		// Check and see if the word is complete
		if (!this.isDeleting && this.txt === fullTxt) {
			// Make a pause at the end
			typeSpeed = this.wait;

			// Set delete to true
			this.isDeleting = true;
		} else if ((this, this.isDeleting && this.txt === "")) {
			this.isDeleting = false;

			// Move to the next word

			this.wordIndex++;

			// Pause before start typing
			typeSpeed = 500;
		}

		setTimeout(() => this.type(), typeSpeed);
	}
}

// Typewriter function
function typeWriter() {
	const txtElement = document.querySelector(".txt-type");
	const words = JSON.parse(txtElement.getAttribute("data-words"));
	const wait = txtElement.getAttribute("data-wait");

	// Init Typewriter
	new Typewriter(txtElement, words, wait);
}

// Display all news
async function displayAllNews() {
	// Get all the news from the database
	const res = await fetch(`${server}/api/news`);
	const data = await res.json();

	// Loop through the news and display them one-by-one
	data.slice(1).forEach((news) => {
		const div = document.createElement("div");
		div.classList.add("box");
		div.innerHTML = `
						<div class="img">
							<img
								src="${news.news_image}"
								alt="${news.title}"
							/>
						</div>
						<div class="details">
							<h5>${news.title}</h5>
							<h6>${news.date}</h6>
							<a class="btn btn-black"href="news-details.html?id=${news._id}"
								>Continue reading</a
							>
						</div>
					`;

		// Insert the new news into the HTML page
		document.querySelector("#boxes").appendChild(div);
	});
}

// Display the latest news
async function displayLatestNews() {
	showSpinner();
	// Get the news from the database
	const res = await fetch(`${server}/api/news`);
	const data = await res.json();
	const latestNews = data[0];

	// Check for the length of the news post
	const newsPost =
		latestNews.post[0].length <= 500
			? latestNews.post[0]
			: `${latestNews.post[0].substring(0, 500)}...`;

	// Create the latest news details
	const div = document.createElement("div");
	div.classList.add("latest-news");
	div.innerHTML = `
					<div class="img">
						<img
							src="${latestNews.news_image}"
							alt="${latestNews.title}"
						/>
					</div>
					<div class="news-details">
						<h5>${latestNews.title}</h5>
						<h6>${latestNews.date}</h6>
						<p>
							${newsPost}
						</p>
						<a class="btn btn-black" href="news-details.html?id=${latestNews._id}"
							>Continue reading</a
						>
					</div>
	`;

	// Insert latest news section to the HTML page
	document.querySelector("#latest-news-section").appendChild(div);
	hideSpinner();
}

// Display the top 3 news for the home page
async function displayTopThreeNews() {
	document.querySelector("#latest-news-spinner").classList.add("show");

	// Get all the news from the database
	const res = await fetch(`${server}/api/news`);
	const data = await res.json();
	const topThreeNews = data.slice(0, 3);

	// Loop through the news and display them one-by-one
	topThreeNews.forEach((news) => {
		const div = document.createElement("div");
		div.classList.add("box");
		div.innerHTML = `
						<div class="img">
							<img
								src="${news.news_image}"
								alt="${news.title}"
							/>
						</div>
						<div class="details">
							<h5>${news.title}</h5>
							<h6>${news.date}</h6>
							<a class="btn btn-black"href="news-details.html?id=${news._id}"
								>Continue reading</a
							>
						</div>
					`;

		// Insert the new news into the HTML page
		document.querySelector("#boxes").appendChild(div);

		document.querySelector("#latest-news-spinner").classList.remove("show");
	});
}

// Display the news details
async function displayNewsDetails() {
	showSpinner();
	// Get the search query from the URL
	const newsId = window.location.search.split("=")[1];

	// Get the news from the database
	const res = await fetch(`${server}/api/news/${newsId}`);
	const data = await res.json();

	// Create a news detail
	const div = document.createElement("div");
	div.classList.add("details");
	div.innerHTML = `
					<div class="head">
						<h4>${data.title}</h4>
						<h5>Posted on ${data.date}</h5>
					</div>
					`;

	// Insert the news image to the showcase section
	const img = document.createElement("img");
	img.src = `${data.news_image}`;
	img.alt = data.title;

	// Insert the news and showcase section
	document.querySelector("#news-details").appendChild(div);
	document.querySelector("#showcase-section").appendChild(img);

	data.post.forEach((p) => {
		// Create paragraph for the article content
		const contentDiv = document.createElement("div");
		contentDiv.classList.add("content");
		contentDiv.innerHTML = `<p>${p}</p>`;

		document.querySelector("#news-details").appendChild(contentDiv);
	});

	// Change the title of the page
	document.title = `${data.title} | ACUSA`;
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", `${data.post.slice(0, 2)}`);
	hideSpinner();
}

// Display the latest article
async function displayLatestArticle() {
	showSpinner();
	// Get the articles from the database
	const res = await fetch(`${server}/api/articles`);
	const data = await res.json();
	const latestArticle = data[0];

	// Check for the length of the news post
	const articlePost =
		latestArticle.post[0].length <= 500
			? latestArticle.post[0]
			: `${latestArticle.post[0].substring(0, 500)}...`;

	// Create the latest news details
	const div = document.createElement("div");
	div.classList.add("latest-article");
	div.innerHTML = `
					<div class="img">
						<img
							src="${latestArticle.article_image}"
							alt="${latestArticle.title}"
						/>
					</div>
					<div class="article-details">
						<h5>${latestArticle.title}</h5>
						<h6>${latestArticle.date}</h6>
						<p>
							${articlePost}
						</p>
						<a class="btn btn-black" href="article-details.html?id=${latestArticle._id}"
							>Continue reading</a
						>
					</div>
	`;

	// Insert latest news section to the HTML page
	document.querySelector("#latest-article-section").appendChild(div);
	hideSpinner();
}

// Display the article for the week
async function displayArticleForTheWeek() {
	document.querySelector("#article-for-week-spinner").classList.add("show");
	// Get the articles from the database
	const res = await fetch(`${server}/api/articles`);
	const data = await res.json();
	const articleForTheWeek = data[0];

	if (articleForTheWeek) {
		// Check for the length of the news post
		const articlePost =
			articleForTheWeek.post[0].length <= 500
				? articleForTheWeek.post[0]
				: `${articleForTheWeek.post[0].substring(0, 500)}...`;

		// Create the latest news details
		const div = document.createElement("div");
		div.classList.add("container");
		div.innerHTML = `
					<div class="article-content">
						<h5>${articleForTheWeek.title}</h5>
						<h6>Posted on ${articleForTheWeek.date}</h6>
						<p>
							${articlePost}
						</p>
						<a class="btn btn-black" href="article-details.html?id=${articleForTheWeek._id}"
							>Continue reading</a
						>
					</div>
					<img
						src="${articleForTheWeek.article_image}"
						alt="${articleForTheWeek.title}"
					/>
	`;

		// Insert article for the week section to the HTML page
		document.querySelector("#article-for-week-section").appendChild(div);
	} else {
	}

	document
		.querySelector("#article-for-week-spinner")
		.classList.remove("show");
}

// Display all articles
async function displayAllArticles() {
	// Get all the articles from the database
	const res = await fetch(`${server}/api/articles`);
	const data = await res.json();
	const allArticles = data;

	// Loop through the news and display them one-by-one
	allArticles.slice(1).forEach((article) => {
		const div = document.createElement("div");
		div.classList.add("box");

		div.innerHTML = `
						<div class="img">
							<img
								src="${article.article_image}"
								alt="${article.title}"
							/>
						</div>
						<div class="details">
							<h5>${article.title}</h5>
							<h6>${article.date}</h6>
							<a class="btn btn-black"href="article-details.html?id=${article._id}"
								>Continue reading</a
							>
						</div>
					`;

		// Insert the new article into the HTML page
		document.querySelector("#boxes").appendChild(div);
	});
}

// Display the article details
async function displayArticleDetails() {
	showSpinner();
	// Get the search query from the URL
	const articleId = window.location.search.split("=")[1];

	// Get the news from the database
	const res = await fetch(`${server}/api/articles/${articleId}`);
	const data = await res.json();

	// Create a news detail
	const div = document.createElement("div");
	div.classList.add("details");
	div.innerHTML = `
					<div class="head">
						<h4>${data.title}</h4>
						<h5>Posted on ${data.date}</h5>
					</div>
					`;

	// Insert the news image to the showcase section
	const img = document.createElement("img");
	img.src = `${data.article_image}`;
	img.alt = data.title;

	// Insert the news and showcase section
	document.querySelector("#article-details").appendChild(div);
	document.querySelector("#showcase-section").appendChild(img);

	data.post.forEach((p) => {
		// Create paragraph for the article content
		const contentDiv = document.createElement("div");
		contentDiv.classList.add("content");
		contentDiv.innerHTML = `<p>${p}</p>`;

		document.querySelector("#article-details").appendChild(contentDiv);
	});

	// Insert the writer's details
	const writerDiv = document.createElement("div");
	writerDiv.classList.add("article-writer");
	writerDiv.innerHTML = `
						<img src="${data.writer_image}" alt="${data.writer_name}" />
						<h5>Written by ${data.writer_name}</h5>
						<div class="contact-details">
							<a target='_blank' href="https://twitter.com/${data.twitter_handle}" class="btn twitter">
								<i class="fa-brands fa-twitter"></i> ${data.twitter_handle}
							</a>
							<a target='_blank' href="https://www.instagram.com/${data.instagram_handle}" class="btn instagram">
								<i class="fa-brands fa-instagram"></i> ${data.instagram_handle}
							</a>
							<a href="tel: ${data.phone_number}" class="btn whatsapp">
								<i class="fa-brands fa-whatsapp"></i> ${data.phone_number}
							</a>
						</div>
						`;

	document.querySelector("#article-details").appendChild(writerDiv);
	// Change the title of the page
	document.title = `${data.title} | ACUSA`;
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", `${data.post.slice(0, 2)}`);
	hideSpinner();
	hideSpinner();
}

// Display the latest archive
async function displayLatestArchive() {
	showSpinner();
	// Get the archives from the database
	const res = await fetch(`${server}/api/archives`);
	const data = await res.json();
	const latestArchive = data[0];

	// Check for the length of the archive post
	const archivePost =
		latestArchive.post[0].length <= 500
			? latestArchive.post[0]
			: `${latestArchive.post[0].substring(0, 500)}...`;

	// Create the latest news details
	const div = document.createElement("div");
	div.classList.add("latest-archive");
	div.innerHTML = `
					<div class="serial-number">
						<img
							src="./images/archives.jpg"
							alt="${latestArchive.serial_number}"
						/>
						<h4>${latestArchive.serial_number}</h4>
					</div>
					<div class="archive-details">
						<h5>${latestArchive.title}</h5>
						<h6>${latestArchive.date}</h6>
						<p>
							${archivePost}
						</p>
						<a class="btn btn-black" href="archive-details.html?id=${latestArchive._id}"
							>Continue reading</a
						>
					</div>
	`;

	// Insert latest news section to the HTML page
	document.querySelector("#latest-archive-section").appendChild(div);
	hideSpinner();
}

// Display all archives
async function displayAllArchives() {
	// Get all the archives from the database
	const res = await fetch(`${server}/api/archives`);
	const data = await res.json();

	// Loop through the news and display them one-by-one
	data.slice(1).forEach((archive) => {
		const div = document.createElement("div");
		div.classList.add("box");

		div.innerHTML = `
						<div class="serial-number">
							<img
								src="./images/archives.jpg"
								alt="${archive.serial_number}"
							/>
							<div class='background-fill'></div>
							<h4>${archive.serial_number}</h4>
						</div>
						<div class="details">
							<h5>${archive.title}</h5>
							<h6>${archive.date}</h6>
							<a class="btn btn-black"href="archive-details.html?id=${archive._id}"
								>Continue reading</a
							>
						</div>
					`;

		// Insert the new archive into the HTML page
		document.querySelector("#boxes").appendChild(div);
	});
}

// Display the archive details
async function displayArchiveDetails() {
	document.querySelector(".spinner-white").classList.add("show");
	// Get the search query from the URL
	const archiveId = window.location.search.split("=")[1];

	// Get the news from the database
	const res = await fetch(`${server}/api/archives/${archiveId}`);
	const data = await res.json();

	// Create a news detail
	const div = document.createElement("div");
	div.classList.add("details");
	div.innerHTML = `
					<div class="head">
						<h4>${data.title}</h4>
						<h5>Posted on ${data.date}</h5>
					</div>
					`;

	// Insert the archive serial number to the showcase section
	const h1 = document.createElement("h1");
	h1.innerText = data.serial_number;

	// Insert the news and showcase section
	document.querySelector("#archive-details").appendChild(div);
	document.querySelector("#showcase-section").appendChild(h1);

	data.post.forEach((p) => {
		// Create paragraph for the archive content
		const contentDiv = document.createElement("div");
		contentDiv.classList.add("content");
		contentDiv.innerHTML = `<p>${p}</p>`;

		document.querySelector("#archive-details").appendChild(contentDiv);
	});

	// Change the title of the page
	document.title = `${data.title} | ACUSA`;
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", `${data.post.slice(0, 2)}`);
	document.querySelector(".spinner-white").classList.remove("show");
}

// Open questions in FAQs
async function openFAQ() {
	// Grab all the questions
	const questions = document.querySelectorAll(".question");

	questions.forEach((question) => {
		const btn = question.querySelector(".title");
		btn.addEventListener("click", () => {
			questions.forEach((item) => {
				if (item !== question) {
					item.classList.remove("show");
				}
			});
			question.classList.toggle("show");
		});
	});
}

async function contactPage() {
	sendContact();
}

const sendContact = async () => {
	document
		.querySelector("#contact-form")
		.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				const name = document.querySelector("#name").value;
				const email = document.querySelector("#email").value;
				const message = document.querySelector("#message").value;

				const newContact = { name, email, message };

				showSmallSpinner();

				const res = await fetch(`${server}/api/contact`, {
					method: "POST",
					body: JSON.stringify(newContact),
					headers: {
						"Content-Type": "application/json",
					},
				});

				await res.json();

				// Clear the field
				document.querySelector("#name").value = "";
				document.querySelector("#email").value = "";
				document.querySelector("#message").value = "";

				// Send notification that the form has been filled successfully
				const notificationDiv = document.createElement("div");
				notificationDiv.classList.add("notification");
				notificationDiv.innerHTML = "<h5>Successful!</h5>";

				document
					.querySelector("#contact-form")
					.appendChild(notificationDiv);

				hideSmallSpinner();
			} catch (err) {}
		});
};

async function feedbackPage() {
	sendFeedback();
}

const sendFeedback = async () => {
	document
		.querySelector("#feedback-form")
		.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				const name = document.querySelector("#name").value;
				const email = document.querySelector("#email").value;
				const feedbackType =
					document.querySelector("#feedback-type").value;
				const message = document.querySelector("#message").value;

				const newFeedback = { name, email, feedbackType, message };

				showSmallSpinner();
				const res = await fetch(`${server}/api/feedback`, {
					method: "POST",
					body: JSON.stringify(newFeedback),
					headers: {
						"Content-Type": "application/json",
					},
				});

				await res.json();

				// Clear the field
				document.querySelector("#name").value = "";
				document.querySelector("#email").value = "";
				document.querySelector("#feedback-type").value = "";
				document.querySelector("#message").value = "";

				// Send notification that the form has been filled successfully
				const notificationDiv = document.createElement("div");
				notificationDiv.classList.add("notification");
				notificationDiv.innerHTML = "<h5>Successful!</h5>";

				document
					.querySelector("#feedback-form")
					.appendChild(notificationDiv);
				hideSmallSpinner();
			} catch (err) {}
		});
};

// Display all archives
async function displayPodasts() {
	showSpinner();
	// Get all the podcasts from the database
	const res = await fetch(`${server}/api/podcasts`);
	const data = await res.json();

	// Loop through the podcasts and display them one-by-one
	data.forEach((podcast) => {
		const div = document.createElement("div");
		div.classList.add("audio_cards");

		div.innerHTML = `
						<div class="audio_img">
							<img src="${podcast.podcast_image}" alt=${podcast.title} />
						</div>
						<div class="audio_content">
							<h5 id="title">${podcast.title}</h5>
							<br />
							<p>
							${
								podcast.excerpt.length <= 200
									? podcast.excerpt
									: `${podcast.excerpt.substring(0, 200)}...`
							}
							</p>

							<br />
							<audio controls>
								<source
									src="${podcast.audio_source}"
									type="audio/mp3"
								/>
							</audio>
						</div>
		`;

		// Insert the new archive into the HTML page
		document.querySelector("#podcasts").appendChild(div);
		hideSpinner();
	});
}

// Get photos from Database for the gallery page
async function getPhotos() {
	showSpinner();
	// Get all the photos from the database
	const res = await fetch(`${server}/api/gallery`);
	const data = await res.json();

	// Loop through the photos and display them one-by-one
	data.slice(1).forEach((photo) => {
		const div = document.createElement("div");
		div.classList.add("photo");

		div.innerHTML = `
		<img src="${photo.secure_url}" alt="${photo.public_id}" />
					`;

		// Insert the new archive into the HTML page
		document.querySelector("#photos").appendChild(div);

		div.addEventListener("click", () => {
			document.querySelector("#image-modal").style.display = "flex";
			document.querySelector("main").style.filter = blur("20px");
			document.querySelector("#image-modal img").src = photo.secure_url;
			document.querySelector("#image-modal img").alt = photo.public_id;
		});

		// Close the modal with the icon
		document.querySelector(".fa-times").onclick = () =>
			(document.querySelector("#image-modal").style.display = "none");

		// Also close the modal with the escape key
		const keyDownHandler = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();

				// 👇️ Close the modal
				document.querySelector("#image-modal").style.display = "none";
			}
		};

		// Call the function
		document.addEventListener("keydown", keyDownHandler);

		// 👇️ clean up event listener
		return () => {
			document.removeEventListener("keydown", keyDownHandler);
		};
	});
	hideSpinner();
}

function showSpinner() {
	document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
	document.querySelector(".spinner").classList.remove("show");
}

function showSmallSpinner() {
	document.querySelector(".spinner-small").classList.add("show");
}

function hideSmallSpinner() {
	document.querySelector(".spinner-small").classList.remove("show");
}

// Init on the DOM Load
document.addEventListener("DOMContentLoaded", init);

// Init App
function init() {
	switch (window.location.pathname) {
		case "/":
		case "/index.html":
			typeWriter();
			displayTopThreeNews();
			displayArticleForTheWeek();
			break;
		case "/news.html":
			displayLatestNews();
			displayAllNews();
			break;
		case "/news-details.html":
			displayNewsDetails();
			break;
		case "/articles.html":
			displayLatestArticle();
			displayAllArticles();
			break;
		case "/article-details.html":
			displayArticleDetails();
			break;
		case "/archives.html":
			displayLatestArchive();
			displayAllArchives();
			break;
		case "/archive-details.html":
			displayArchiveDetails();
			break;
		case "/gallery.html":
			getPhotos();
			break;
		case "/faq.html":
			openFAQ();
			break;
		case "/contact.html":
			contactPage();
			break;
		case "/feedback.html":
			feedbackPage();
			break;
		case "/podcasts.html":
			displayPodasts();
			break;
	}
}

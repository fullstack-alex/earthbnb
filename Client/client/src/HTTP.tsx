import React, { useState, useEffect } from "react";

const API_KEY = "";
const HOST = "localhost:7086";

export default class HTTP
{
	static async Login(username: string, pass:string)
	{
		const requestHeaders: HeadersInit = new Headers();
		requestHeaders.set("password", pass);
		requestHeaders.set("username", username);
		// return await HTTP.Get("https://localhost:7263/UserProfile/login", requestHeaders);
		return await HTTP.Get("https://localhost:7263/UserProfile/login", requestHeaders).then();
	}

	static async Get(endpoint:string, headers:Headers) {
		headers.set("Host", HOST);
	    return await fetch(endpoint, {
	        method: "GET",
	        headers
	    })
		.then(response => response.text())
		.catch((error) => console.log(error));
	}

	static async Post(title:string, body:string, endpoint:string) {
			await fetch(endpoint, {
	        method: "Post",
	        headers: {
				"Host": HOST,
	        },
			body: JSON.stringify({
			   title: title,
			   body: body,
			})

	    })
		.then((response) => response.json())
	    .catch((error) => console.log(error));
	}
}
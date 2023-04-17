module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleDirectories: ["node_modules", "src"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	testMatch: ["<rootDir>/tests/**/*.(test|spec).ts"],
};

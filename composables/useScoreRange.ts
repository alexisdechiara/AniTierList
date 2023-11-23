import { ScoreFormat } from "#gql/default";

export default function (scoreFormat: string) {
	return useState("scoreRange", (): number[] => {
		switch (scoreFormat) {
			case ScoreFormat["POINT_100"]:
				return [0, 100];
			case ScoreFormat["POINT_10_DECIMAL"] || ScoreFormat["POINT_10"]:
				return [0, 10];
			case ScoreFormat["POINT_5"]:
				return [0, 5];
			case ScoreFormat["POINT_3"]:
				return [0, 3];
			default:
				return [0, 10];
		}
	}); // Ajoutez une parenthèse ici pour fermer la fonction useState
}

package controllers;

import java.util.ArrayList;
import java.util.List;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.SqlQuery;
import com.avaje.ebean.SqlRow;

import constantes.IConstantes;

public class ServiceCentralien extends Controller {

	public static Result AJAX_listeDesCentraliens() {
		String sql = "SELECT centralien_ID AS identifiant, CONCAT(centralien_prenom, ' ', centralien_nom) AS prenomNom FROM Centralien";
		sql += " ORDER BY prenomNom DESC";

		SqlQuery sqlQuery = Ebean.createSqlQuery(sql);
		List<SqlRow> listSqlRow = sqlQuery.findList();
		// Liste de double String : le premier est l'ID et le deuxième est le
		// prenomNom
		List<String[]> listeDesCentraliens = new ArrayList<String[]>();
		for (SqlRow sqlRow : listSqlRow) {
			String identifiant = sqlRow.get("identifiant").toString();
			String prenomNom = sqlRow.get("prenomNom").toString();
			listeDesCentraliens.add(new String[] { identifiant, prenomNom });
		}

		return ok(Json.toJson(listeDesCentraliens));
	}

	public static Result AJAX_listeDesCentraliensSelonCriteres(
	        String anneePromotion_ID, String ecole_ID,
	        String entreprise_ID, String secteur_nom, String pays_nom,
	        String ville_nom) {
		Boolean[] parametresPresents = new Boolean[] {
				anneePromotion_ID != null
		                && !anneePromotion_ID.isEmpty(),
		        ecole_ID != null
		                && !ecole_ID.isEmpty()
		                && !ecole_ID
		                        .equals(IConstantes.ECOLE_OU_ENTREPRISE_INACTIF),
		        entreprise_ID != null
		                && !entreprise_ID.isEmpty()
		                && !entreprise_ID
		                        .equals(IConstantes.ECOLE_OU_ENTREPRISE_INACTIF),
		        secteur_nom != null && !secteur_nom.isEmpty(),
		        pays_nom != null && !pays_nom.isEmpty(),
		        ville_nom != null && !ville_nom.isEmpty() };

		Boolean wherePlace = false;

		String sql = "SELECT centralien_ID AS identifiant, CONCAT(centralien_prenom, ' ', centralien_nom) AS prenomNom FROM Centralien";
		
		if (parametresPresents[0]) {
			wherePlace = true;
			sql += " WHERE ";
			sql += "centralien_anneePromotion_ID = :anneePromotion_ID";
		}

		if (parametresPresents[1]) {
			if (wherePlace) {
				sql += " AND ";
			} else {
				sql += " WHERE ";
				wherePlace = true;
			}
			sql += "centralien_ID IN (";
			sql += "SELECT ecoleSecteurCentralien_Centralien_ID FROM EcoleSecteurCentralien, EcoleSecteur WHERE ecoleSecteur_ecole_ID = :ecole_ID";
			sql += " AND ";
			sql += "ecoleSecteurCentralien_ecoleSecteur_ID = ecoleSecteur_ID ";
			sql += ")";
		}

		if (parametresPresents[2]) {
			if (wherePlace) {
				sql += " AND ";
			} else {
				sql += " WHERE ";
				wherePlace = true;
			}
			sql += "centralien_ID IN (";
			sql += "SELECT entrepriseVilleSecteurCentralien_Centralien_ID FROM EntrepriseVilleSecteurCentralien, EntrepriseVilleSecteur WHERE entrepriseVilleSecteur_entreprise_ID = :entreprise_ID";
			sql += " AND ";
			sql += "entrepriseVilleSecteurCentralien_entrepriseVilleSecteur_ID = entrepriseVilleSecteur_ID ";
			sql += ")";
		}

		if (parametresPresents[3]) {
			if (wherePlace) {
				sql += " AND ";
			} else {
				sql += " WHERE ";
				wherePlace = true;
			}
			if (ecole_ID.equals(IConstantes.ECOLE_OU_ENTREPRISE_INACTIF)) {
				sql += "centralien_ID IN (";
				sql += "SELECT entrepriseVilleSecteurCentralien_Centralien_ID FROM EntrepriseVilleSecteurCentralien, EntrepriseVilleSecteur WHERE entrepriseVilleSecteur_secteur_ID = (";
				sql += "SELECT secteur_ID FROM Secteur WHERE secteur_nom = :secteur_nom";
				sql += ")";
				sql += " AND ";
				sql += "entrepriseVilleSecteurCentralien_entrepriseVilleSecteur_ID = entrepriseVilleSecteur_ID ";
				sql += ")";
			} else {
				sql += "centralien_ID IN (";
				sql += "SELECT ecoleSecteurCentralien_Centralien_ID FROM EcoleSecteurCentralien, EcoleSecteur WHERE ecoleSecteur_secteur_ID = (";
				sql += "SELECT secteur_ID FROM Secteur WHERE secteur_nom = :secteur_nom";
				sql += ")";
				sql += " AND ";
				sql += "ecoleSecteurCentralien_ecoleSecteur_ID = ecoleSecteur_ID ";
				sql += ")";
			}
		}

		if (parametresPresents[4] && !parametresPresents[5]) {
			if (wherePlace) {
				sql += " AND ";
			} else {
				sql += " WHERE ";
				wherePlace = true;
			}
			if (ecole_ID.equals(IConstantes.ECOLE_OU_ENTREPRISE_INACTIF)) {
				sql += "centralien_ID IN (";
				sql += "SELECT entrepriseVilleSecteurCentralien_Centralien_ID FROM EntrepriseVilleSecteurCentralien, EntrepriseVilleSecteur WHERE entrepriseVilleSecteur_ville_ID IN (";
				sql += "SELECT ville_ID FROM Ville, Pays WHERE ville_pays_ID = pays_ID AND pays_nom = :pays_nom";
				sql += ")";
				sql += " AND ";
				sql += "entrepriseVilleSecteurCentralien_entrepriseVilleSecteur_ID = entrepriseVilleSecteur_ID ";
				sql += ")";
			} else {
				sql += "centralien_ID IN (";
				sql += "SELECT ecoleSecteurCentralien_Centralien_ID FROM EcoleSecteur, EcoleSecteurCentralien, Ecole WHERE ecole_ville_ID IN (";
				sql += "SELECT ville_ID FROM Ville, Pays WHERE ville_pays_ID = pays_ID AND pays_nom = :pays_nom";
				sql += ")";
				sql += " AND ";
				sql += "ecoleSecteurCentralien_ecoleSecteur_ID = ecoleSecteur_ID ";
				sql += " AND ";
				sql += "ecoleSecteur_ecole_ID = ecole_ID ";
				sql += ")";
			}
		}

		if (parametresPresents[5]) {
			if (wherePlace) {
				sql += " AND ";
			} else {
				sql += " WHERE ";
				wherePlace = true;
			}
			if (ecole_ID.equals(IConstantes.ECOLE_OU_ENTREPRISE_INACTIF)) {
				sql += "centralien_ID IN (";
				sql += "SELECT entrepriseVilleSecteurCentralien_Centralien_ID FROM EntrepriseVilleSecteurCentralien, EntrepriseVilleSecteur WHERE entrepriseVilleSecteur_ville_ID = (";
				sql += "SELECT ville_ID FROM Ville WHERE ville_nom = :ville_nom";
				sql += ")";
				sql += " AND ";
				sql += "entrepriseVilleSecteurCentralien_entrepriseVilleSecteur_ID = entrepriseVilleSecteur_ID ";
				sql += ")";
			} else {
				sql += "centralien_ID IN (";
				sql += "SELECT ecoleSecteurCentralien_Centralien_ID FROM EcoleSecteurCentralien, Ecole, EcoleSecteur WHERE ecole_ville_ID = (";
				sql += "SELECT ville_ID FROM Ville WHERE ville_nom = :ville_nom";
				sql += ")";
				sql += " AND ";
				sql += "ecoleSecteurCentralien_ecoleSecteur_ID = ecoleSecteur_ID ";
				sql += " AND ";
				sql += "ecoleSecteur_ecole_ID = ecole_ID ";
				sql += ")";
			}
		}

		sql += " ORDER BY prenomNom DESC";

		SqlQuery sqlQuery = Ebean.createSqlQuery(sql);
		if (parametresPresents[0]) {
			sqlQuery.setParameter("anneePromotion_ID",
			        Integer.parseInt(anneePromotion_ID));
		}
		if (parametresPresents[1]) {
			sqlQuery.setParameter("ecole_ID", Integer.parseInt(ecole_ID));
		}
		if (parametresPresents[2]) {
			sqlQuery.setParameter("entreprise_ID", Integer.parseInt(entreprise_ID));
		}
		if (parametresPresents[3]) {
			sqlQuery.setParameter("secteur_nom", secteur_nom);
		}
		if (parametresPresents[4] && !parametresPresents[5]) {
			sqlQuery.setParameter("pays_nom", pays_nom);
		}
		if (parametresPresents[5]) {
			sqlQuery.setParameter("ville_nom", ville_nom);
		}

		List<SqlRow> listSqlRow = sqlQuery.findList();
	
		// Liste de double String : le premier est l'ID et le deuxième est le
		// prenomNom
		List<String[]> listeDesCentraliensParCriteres = new ArrayList<String[]>();
		for (SqlRow sqlRow : listSqlRow) {
			String identifiant = sqlRow.get("identifiant").toString();
			String prenomNom = sqlRow.get("prenomNom").toString();
			listeDesCentraliensParCriteres.add(new String[] { identifiant, prenomNom });
		}

		return ok(Json.toJson(listeDesCentraliensParCriteres));
	}

}

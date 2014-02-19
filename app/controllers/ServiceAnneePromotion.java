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

public class ServiceAnneePromotion extends Controller {

	public static Result AJAX_listeDesAnneesPromotion() {
		String sql = "SELECT anneePromotion_ID, anneePromotion_libelle FROM AnneePromotion ORDER BY anneePromotion_libelle DESC";

		SqlQuery sqlQuery = Ebean.createSqlQuery(sql);
		List<SqlRow> listSqlRow = sqlQuery.findList();
		// Liste de double String : le premier est l'ID et le deuxième est le libelle
		List<String[]> listeDesAnneesPromotion = new ArrayList<String[]>();
		for (SqlRow sqlRow : listSqlRow) {
			String identifiant = sqlRow.get("anneePromotion_ID").toString();
			String prenomNom = sqlRow.get("anneePromotion_libelle").toString();
			listeDesAnneesPromotion.add(new String[] { identifiant, prenomNom });
		}

		return ok(Json.toJson(listeDesAnneesPromotion));
	}

	public static Result AJAX_listeDesAnneesPromotionSelonCriteres(
	        String centralien_ID, String ecole_ID, String entreprise_ID,
	        String secteur_nom, String pays_nom, String ville_nom) {
		Boolean[] parametresPresents = new Boolean[] {
				centralien_ID != null && !centralien_ID.isEmpty(),
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

		String sql = "SELECT anneePromotion_ID, anneePromotion_libelle FROM AnneePromotion";

		if (parametresPresents[0]) {
			wherePlace = true;
			sql += " WHERE ";
			sql += "anneePromotion_ID = (";
			sql += "SELECT centralien_anneePromotion_ID FROM Centralien WHERE centralien_ID = :centralien_ID";
			sql += ")";
		}

		if (parametresPresents[1]) {
			if (wherePlace) {
				sql += " AND ";
			} else {
				sql += " WHERE ";
				wherePlace = true;
			}
			sql += "anneePromotion_ID IN (";
			sql += "SELECT centralien_anneePromotion_ID FROM Centralien WHERE centralien_ID IN (";
			sql += "SELECT ecoleSecteurCentralien_ID FROM EcoleSecteurCentralien, EcoleSecteur WHERE ecoleSecteur_ecole_ID = :ecole_ID";
			sql += " AND ";
			sql += "ecoleSecteurCentralien_ecoleSecteur_ID = ecoleSecteur_ID ";
			sql += "))";
		}

		if (parametresPresents[2]) {
			if (wherePlace) {
				sql += " AND ";
			} else {
				sql += " WHERE ";
				wherePlace = true;
			}
			sql += "anneePromotion_ID IN (";
			sql += "SELECT centralien_anneePromotion_ID FROM Centralien WHERE centralien_ID IN (";
			sql += "SELECT entrepriseVilleSecteurCentralien_ID FROM EntrepriseVilleSecteurCentralien, EntrepriseVilleSecteur WHERE entrepriseVilleSecteur_entreprise_ID = :entreprise_ID";
			sql += " AND ";
			sql += "entrepriseVilleSecteurCentralien_entrepriseVilleSecteur_ID = entrepriseVilleSecteur_ID ";
			sql += "))";
		}

		if (parametresPresents[3]) {
			if (wherePlace) {
				sql += " AND ";
			} else {
				sql += " WHERE ";
				wherePlace = true;
			}
			
			if (ecole_ID.equals(IConstantes.ECOLE_OU_ENTREPRISE_INACTIF)){
				sql += "anneePromotion_ID IN (";
				sql += "SELECT centralien_anneePromotion_ID FROM Centralien WHERE centralien_ID IN (";
				sql += "SELECT entrepriseVilleSecteurCentralien_ID FROM EntrepriseVilleSecteurCentralien, EntrepriseVilleSecteur WHERE entrepriseVilleSecteur_secteur_ID = (";
				sql += "SELECT secteur_ID FROM Secteur WHERE secteur_nom = :secteur_nom";
				sql += ")";
				sql += " AND ";
				sql += "entrepriseVilleSecteurCentralien_entrepriseVilleSecteur_ID = entrepriseVilleSecteur_ID ";
				sql += "))";
			} else {
				sql += "anneePromotion_ID IN (";
				sql += "SELECT centralien_anneePromotion_ID FROM Centralien WHERE centralien_ID IN (";
				sql += "SELECT ecoleSecteurCentralien_Centralien_ID FROM EcoleSecteurCentralien, EcoleSecteur WHERE ecoleSecteur_secteur_ID = (";
				sql += "SELECT secteur_ID FROM Secteur WHERE secteur_nom = :secteur_nom";
				sql += ")";
				sql += " AND ";
				sql += "ecoleSecteurCentralien_ecoleSecteur_ID = ecoleSecteur_ID ";
				sql += "))";						
			}
		}

		if (parametresPresents[4] && !parametresPresents[5]) {
			if (wherePlace) {
				sql += " AND ";
			} else {
				sql += " WHERE ";
				wherePlace = true;
			}
			if (ecole_ID.equals(IConstantes.ECOLE_OU_ENTREPRISE_INACTIF)){
				sql += "anneePromotion_ID IN (";
				sql += "SELECT centralien_anneePromotion_ID FROM Centralien WHERE centralien_ID IN (";
				sql += "SELECT entrepriseVilleSecteurCentralien_ID FROM EntrepriseVilleSecteurCentralien, EntrepriseVilleSecteur WHERE entrepriseVilleSecteur_ville_ID IN (";
				sql += "SELECT ville_ID FROM Ville, Pays WHERE ville_pays_ID = pays_ID AND pays_nom = :pays_nom";
				sql += ")";
				sql += " AND ";
				sql += "entrepriseVilleSecteurCentralien_entrepriseVilleSecteur_ID = entrepriseVilleSecteur_ID ";
				sql += "))";
			} else {
				sql += "anneePromotion_ID IN (";
				sql += "SELECT centralien_anneePromotion_ID FROM Centralien WHERE centralien_ID IN (";
				sql += "SELECT ecoleSecteurCentralien_Centralien_ID FROM EcoleSecteur, EcoleSecteurCentralien, Ecole WHERE ecole_ville_ID IN (";
				sql += "SELECT ville_ID FROM Ville, Pays WHERE ville_pays_ID = pays_ID AND pays_nom = :pays_nom";
				sql += ")";
				sql += " AND ";
				sql += "ecoleSecteurCentralien_ecoleSecteur_ID = ecoleSecteur_ID ";
				sql += " AND ";
				sql += "ecoleSecteur_ecole_ID = ecole_ID ";				
				sql += "))";		
			}
		}

		if (parametresPresents[5]) {
			if (wherePlace) {
				sql += " AND ";
			} else {
				sql += " WHERE ";
				wherePlace = true;
			}
			if (ecole_ID.equals(IConstantes.ECOLE_OU_ENTREPRISE_INACTIF)){
				sql += "anneePromotion_ID IN (";
				sql += "SELECT centralien_anneePromotion_ID FROM Centralien WHERE centralien_ID IN (";
				sql += "SELECT entrepriseVilleSecteurCentralien_ID FROM EntrepriseVilleSecteurCentralien, EntrepriseVilleSecteur WHERE entrepriseVilleSecteur_ville_ID = (";
				sql += "SELECT ville_ID FROM Ville WHERE ville_nom = :ville_nom";
				sql += ")";
				sql += " AND ";
				sql += "entrepriseVilleSecteurCentralien_entrepriseVilleSecteur_ID = entrepriseVilleSecteur_ID ";
				sql += "))";
			} else {
				sql += "anneePromotion_ID IN (";
				sql += "SELECT centralien_anneePromotion_ID FROM Centralien WHERE centralien_ID IN (";
				sql += "SELECT ecoleSecteurCentralien_Centralien_ID FROM EcoleSecteurCentralien, Ecole, EcoleSecteur WHERE ecole_ville_ID = (";
				sql += "SELECT ville_ID FROM Ville WHERE ville_nom = :ville_nom";
				sql += ")";
				sql += " AND ";
				sql += "ecoleSecteurCentralien_ecoleSecteur_ID = ecoleSecteur_ID ";
				sql += " AND ";
				sql += "ecoleSecteur_ecole_ID = ecole_ID ";		
				sql += "))";	
			}
		}

		sql += " ORDER BY anneePromotion_libelle ASC";

		SqlQuery sqlQuery = Ebean.createSqlQuery(sql);
		if (parametresPresents[0]) {
			sqlQuery.setParameter("centralien_ID", Integer.parseInt(centralien_ID));
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
		// Liste de double String : le premier est l'ID et le deuxième est le libelle
		List<String[]> listeDesAnneesPromotionParCriteres = new ArrayList<String[]>();
		for (SqlRow sqlRow : listSqlRow) {
			String identifiant = sqlRow.get("anneePromotion_ID").toString();
			String prenomNom = sqlRow.get("anneePromotion_libelle").toString();
			listeDesAnneesPromotionParCriteres.add(new String[] { identifiant, prenomNom });
		}

		return ok(Json.toJson(listeDesAnneesPromotionParCriteres));
	}

}

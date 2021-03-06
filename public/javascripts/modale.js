/****************************************************************************

Copyright 2014 Anthony Labaere

Contributeurs : 
François Neber francois.neber@centraliens-nantes.net
Malik Olivier Boussejra malik.boussejra@centraliens-nantes.net
Anthony Labaere anthony.labaere@centraliens-nantes.net

Ce logiciel est un programme informatique ayant pour but de faciliter 
les contacts entre étudiants et diplômés de l'École Centrale Nantes 
à l'étranger comme en France.

Ce logiciel est régi par la licence CeCILL soumise au droit français et
respectant les principes de diffusion des logiciels libres. Vous pouvez
utiliser, modifier et/ou redistribuer ce programme sous les conditions
de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA 
sur le site "http://www.cecill.info".

En contrepartie de l'accessibilité au code source et des droits de copie,
de modification et de redistribution accordés par cette licence, il n'est
offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
seule une responsabilité restreinte pèse sur l'auteur du programme,  le
titulaire des droits patrimoniaux et les concédants successifs.

A cet égard  l'attention de l'utilisateur est attirée sur les risques
associés au chargement,  à l'utilisation,  à la modification et/ou au
développement et à la reproduction du logiciel par l'utilisateur étant 
donné sa spécificité de logiciel libre, qui peut le rendre complexe à 
manipuler et qui le réserve donc à des développeurs et des professionnels
avertis possédant  des  connaissances  informatiques approfondies.  Les
utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
logiciel à leurs besoins dans des conditions permettant d'assurer la
sécurité de leurs systèmes et ou de leurs données et, plus généralement, 
à l'utiliser et l'exploiter dans les mêmes conditions de sécurité. 

Le fait que vous puissiez accéder à cet en-tête signifie que vous avez 
pris connaissance de la licence CeCILL et que vous en avez accepté les
termes.

******************************************************************************/

/**
 * -----------------------------------------------------------------------------
 * Ce fichier contient les fonctions portant sur les modale des coordonnées
 * -----------------------------------------------------------------------------
 */

/**
 * Cette fonction permet d'afficher une modale lors d'un clic sur un marqueur
 * ville
 */
function afficherModale() {
	var popID = 'modale';
	var popWidth = 500;

	// Faire apparaitre la pop-up et ajouter le bouton de
	// fermeture
	jQuery('#' + popID)
			.fadeIn()
			.prepend(
					'<a href="#" class="fermer"><img src="/assets/images/fermer.png" class="bouton_fermeture" title="Close Window" alt="Close" /></a>');

	// Récupération du margin, qui permettra de centrer la
	// fenêtre - on ajuste de 80px en conformité avec le CSS
	var popMargTop = ($('#' + popID).height() + 80) / 2;
	var popMargLeft = ($('#' + popID).width() + 80) / 2;

	// Apply Margin to Popup
	$('#' + popID).css({
		'margin-top' : -popMargTop,
		'margin-left' : -popMargLeft
	});

	// Apparition du fond - .css({'filter' :
	// 'alpha(opacity=80)'}) pour corriger les bogues
	// d'anciennes versions de IE
	$('body').append('<div id="modale_fond"></div>');
	$('#modale_fond').css({
		'filter' : 'alpha(opacity=80)'
	}).fadeIn();

	return false;
}

/**
 * Cette fonction alimente la modale en fonction des informations a afficher
 */
function alimenterModale(ville_ID, limite, numeroBloc, tri) {

	// On enregistre les valeurs des filtres dans des variables pour l'appel
	// Ajax
	var historique = HTML(CHECKBOX_HISTORIQUE_ID).checked;
	var centralien_ID;
	var anneePromotion_ID;
	var ecole_ID;
	var entreprise_ID;
	var secteur_ID;

	if (!tri) {
		tri = "defaut";
	}

	// On indique au serveur a partir de quelles lignes il doit chercher les
	// resultats
	var offset = (numeroBloc - 1) * limite;

	// On indique au serveur quel est le filtre ignore entre Ecole
	// ou Entreprise
	if (HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID])) {
		entreprise_ID = ECOLE_OU_ENTREPRISE_INACTIF;
	} else {
		ecole_ID = ECOLE_OU_ENTREPRISE_INACTIF;
	}

	if (HTML(ARRAY_FILTRES[ARRAY_FILTRES_CENTRALIEN][ARRAY_FILTRE_ID]).selectedIndex != 0) {
		centralien_ID = HTML(ARRAY_FILTRES[ARRAY_FILTRES_CENTRALIEN][ARRAY_FILTRE_ID]).value;
	}
	if (HTML(ARRAY_FILTRES[ARRAY_FILTRES_ANNEEPROMOTION][ARRAY_FILTRE_ID]).selectedIndex != 0) {
		anneePromotion_ID = HTML(ARRAY_FILTRES[ARRAY_FILTRES_ANNEEPROMOTION][ARRAY_FILTRE_ID]).value;
	}
	if (HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID])
			&& HTML(ARRAY_FILTRES[ARRAY_FILTRES_ECOLE][ARRAY_FILTRE_ID]).selectedIndex != 0) {
		ecole_ID = HTML(ARRAY_FILTRES[ARRAY_FILTRES_ECOLE][ARRAY_FILTRE_ID]).value;
	}
	if (HTML(ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ID])
			&& HTML(ARRAY_FILTRES[ARRAY_FILTRES_ENTREPRISE][ARRAY_FILTRE_ID]).selectedIndex != 0) {
		entreprise_ID = HTML(ARRAY_FILTRES[ARRAY_FILTRES_ENTREPRISE][ARRAY_FILTRE_ID]).value;
	}
	if (HTML(ARRAY_FILTRES[ARRAY_FILTRES_SECTEUR][ARRAY_FILTRE_ID]).selectedIndex != 0) {
		secteur_ID = HTML(ARRAY_FILTRES[ARRAY_FILTRES_SECTEUR][ARRAY_FILTRE_ID]).value;
	}

	// On supprime le tableau precedent s'il existe
	var modale = HTML('modale');
	modale.innerHTML = '';

	// On rappelle a l'utilisateur les criteres precedemments renseignes :
	var rappel = document.createElement('div');
	rappel.setAttribute('id', 'rappel');
	var rappelTexte = '';
	if (centralien_ID) {
		rappelTexte += 'Coordonn&eacute;es de l\'activit&eacute; ';
		if (HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID])) {
			rappelTexte += ' &eacute;tudiante ';
		} else {
			rappelTexte += ' professionnelle ';
		}
		rappelTexte += 'du Centralien '
				+ HTML(ARRAY_FILTRE_CENTRALIEN[ARRAY_FILTRE_ID] + "_"
						+ centralien_ID).text;
		rappelTexte += ' dans la ville '
				+ HTML(ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ID] + "_" + ville_ID).text;
	} else {
		rappelTexte += 'Coordonn&eacute;es des Centraliens';

		if (HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID])) {
			if (historique) {
				rappelTexte += ' ayant &eacute;tudi&eacute; &agrave; ';
			} else {
				rappelTexte += ' &eacute;tudiant &agrave; ';
			}
		} else {
			if (historique) {
				rappelTexte += ' ayant travaill&eacute; &agrave; ';
			} else {
				rappelTexte += ' travaillant &agrave; ';
			}
		}
		rappelTexte += HTML(ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ID] + "_"
				+ ville_ID).text;
		if (HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID])) {
			if (ecole_ID) {
				rappelTexte += ' , à l\&Eacute;cole '
						+ HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID] + "_"
								+ ecole_ID).text;
			}
		} else {
			if (entreprise_ID) {
				rappelTexte += ' pour l\'entreprise '
						+ HTML(ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ID] + "_"
								+ entreprise_ID).text;
			}
		}
		if (secteur_ID) {
			rappelTexte += ' dans le secteur '
					+ HTML(ARRAY_FILTRE_SECTEUR[ARRAY_FILTRE_ID] + "_"
							+ secteur_ID).text;
		}
	}

	rappel.innerHTML = rappelTexte;
	modale.appendChild(rappel);

	// On insere la base du tableau dans la modale
	var prenomTh = document.createElement('th');
	prenomTh.setAttribute('onClick', 'alimenterModale(' + ville_ID + ', '
			+ limite + ', ' + numeroBloc + ', "prenom");afficherModale();');
	prenomTh.innerHTML = 'Pr&eacute;nom';
	var nomTh = document.createElement('th');
	nomTh.setAttribute('onClick', 'alimenterModale(' + ville_ID + ', ' + limite
			+ ', ' + numeroBloc + ', "nom");afficherModale();');
	nomTh.innerHTML = 'Nom';
	var telephoneTh = document.createElement('th');
	telephoneTh.setAttribute('onClick', 'alimenterModale(' + ville_ID + ', ' + limite
			+ ', ' + numeroBloc + ', "telephone");afficherModale();');
	telephoneTh.innerHTML = 'T&eacute;l&eacute;phone';
	var mailTh = document.createElement('th');
	mailTh.setAttribute('onClick', 'alimenterModale(' + ville_ID + ', ' + limite
			+ ', ' + numeroBloc + ', "mail");afficherModale();');
	mailTh.innerHTML = 'Mail';
	var anneePromotionTh = document.createElement('th');
	anneePromotionTh.setAttribute('onClick', 'alimenterModale(' + ville_ID
			+ ', ' + limite + ', ' + numeroBloc
			+ ', "anneePromotion");afficherModale();');
	anneePromotionTh.innerHTML = 'Promotion';
	var posteTh = document.createElement('th');
	posteTh.setAttribute('onClick', 'alimenterModale(' + ville_ID
			+ ', ' + limite + ', ' + numeroBloc
			+ ', "poste");afficherModale();');
	posteTh.innerHTML = 'Poste';
	var ecoleOuEntrepriseTh = document.createElement('th');
	if (HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID])) {
		ecoleOuEntrepriseTh.setAttribute('onClick', 'alimenterModale('
				+ ville_ID + ', ' + limite + ', ' + numeroBloc
				+ ', "ecole");afficherModale();');
		ecoleOuEntrepriseTh.innerHTML = "Ecole";
	} else {
		ecoleOuEntrepriseTh.setAttribute('onClick', 'alimenterModale('
				+ ville_ID + ', ' + limite + ', ' + numeroBloc
				+ ', "entreprise");afficherModale();');
		ecoleOuEntrepriseTh.innerHTML = "Entreprise";
	}
	var secteurTh = document.createElement('th');
	secteurTh.setAttribute('onClick', 'alimenterModale(' + ville_ID + ', '
			+ limite + ', ' + numeroBloc + ', "secteur");afficherModale();');
	secteurTh.innerHTML = 'Secteur';

	var bodyTr = document.createElement('tr');
	bodyTr.appendChild(prenomTh);
	bodyTr.appendChild(nomTh);
	bodyTr.appendChild(telephoneTh);
	bodyTr.appendChild(mailTh);
	bodyTr.appendChild(anneePromotionTh);
	bodyTr.appendChild(posteTh);
	bodyTr.appendChild(ecoleOuEntrepriseTh);
	bodyTr.appendChild(secteurTh);

	var enTeteTableau = document.createElement('thead');
	enTeteTableau.appendChild(bodyTr);

	var tableau_coordonnees = document.createElement('table');
	tableau_coordonnees.setAttribute('id', 'tableau_coordonnees');
	tableau_coordonnees.appendChild(enTeteTableau);

	modale.appendChild(tableau_coordonnees);

	// Et on ajoute les nouvelles a partir de la requete AJAX
	// "AJAX_listeDesCoordonneesDesCentraliens"
	jsRoutes.controllers.ServiceCentralien
			.AJAX_listeDesCoordonneesDesCentraliens(historique,
					centralien_ID ? centralien_ID : "",
					anneePromotion_ID ? anneePromotion_ID : "",
					ecole_ID ? ecole_ID : "",
					entreprise_ID ? entreprise_ID : "",
					secteur_ID ? secteur_ID : "", ville_ID ? ville_ID : "",
					limite, offset, false, tri ? tri : "").ajax({
				async : false,
				success : function(data, textStatus, jqXHR) {

					// On alimente le tableau de coordonnees
					var tableau_coordonnees = HTML('tableau_coordonnees');

					for ( var element in data) {
						var prenomTd = document.createElement('td');
						prenomTd.innerHTML = data[element][0];
						var nomTd = document.createElement('td');
						nomTd.innerHTML = data[element][1];
						var telephoneTd = document.createElement('td');
						telephoneTd.innerHTML = data[element][2];
						var mailTd = document.createElement('td');
						mailTd.innerHTML = data[element][3];
						var anneePromotionTd = document.createElement('td');
						anneePromotionTd.innerHTML = data[element][4];
						var posteTd = document.createElement('td');
						posteTd.innerHTML = data[element][5];
						var ecoleOuEntrepriseTd = document.createElement('td');
						ecoleOuEntrepriseTd.innerHTML = data[element][6];
						var secteurTd = document.createElement('td');
						secteurTd.innerHTML = data[element][7];

						var modaleTr = document.createElement('tr');
						modaleTr.appendChild(prenomTd);
						modaleTr.appendChild(nomTd);
						modaleTr.appendChild(telephoneTd);
						modaleTr.appendChild(mailTd);
						modaleTr.appendChild(anneePromotionTd);
						modaleTr.appendChild(posteTd);
						modaleTr.appendChild(ecoleOuEntrepriseTd);
						modaleTr.appendChild(secteurTd);

						tableau_coordonnees.appendChild(modaleTr);
					}
				}
			});

	// On met en place la pagination
	jsRoutes.controllers.ServiceCentralien
			.AJAX_listeDesCoordonneesDesCentraliens(historique,
					centralien_ID ? centralien_ID : "",
					anneePromotion_ID ? anneePromotion_ID : "",
					ecole_ID ? ecole_ID : "",
					entreprise_ID ? entreprise_ID : "",
					secteur_ID ? secteur_ID : "", ville_ID ? ville_ID : "",
					limite, offset, true, tri ? tri : "").ajax(
					{
						async : false,
						success : function(data, textStatus, jqXHR) {
							var nombre_pages = Math.ceil(data / NOMBRE_LIGNES);

							if (nombre_pages > 1) {
								var pagination = document.createElement('ul');
								pagination.setAttribute('id', 'pagination');
								pagination.innerHTML = '';
								for ( var i = 1; i <= nombre_pages; i++) {
									var li = document.createElement('li');
									if (i != numeroBloc){
										li.setAttribute('onClick', 'alimenterModale(' + ville_ID + ', '
												+ limite + ', ' + i + ');afficherModale();');
										li.className= "page_autre"; 	
									} else {	
										li.className= "page_selectionnee"; 
									}
									li.innerHTML = i;
									pagination.appendChild(li);
								}
								
								modale.appendChild(pagination);
							}
						}
					});
}

/**
 * Cette fonction jQuery supprime la modale lors d'un clic sur son bouton de
 * fermeture ou sur la carte (en dehors de la modale)
 */
jQuery(function($) {
	// Fermer la modale et supprimer la transparence noire de l'arriere plan
	$('body').on('click', 'a.fermer, #modale_fond', function() {
		// Lors d'un clic sur body :
		$('#modale_fond , .modale_block').fadeOut(function() {
			$('#modale_fond, a.fermer').remove();
		});
		return false;
	});
});
<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* @nucleus/content/particle.html.twig */
class __TwigTemplate_f34dad61e1aae40e0a7223122184e43b6e15967e8dab08168f9f86b34a405e9f extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        try {            // line 2
            echo "    ";
            $context["in_particle"] = ((($context["in_particle"]) ?? (0)) + 1);
            // line 3
            echo "    ";
            if ((($context["in_particle"] ?? null) > 5)) {
                // line 4
                echo "        ";
                throw new \RuntimeException("Particle loop detected"                ,                 500                );
                // line 5
                echo "    ";
            }
            // line 6
            echo "
    ";
            // line 7
            $context["id"] = $this->getAttribute(($context["segment"] ?? null), "id", []);
            // line 8
            echo "    ";
            if ( !($context["particle"] ?? null)) {
                // line 9
                echo "        ";
                if (($context["noConfig"] ?? null)) {
                    // line 10
                    echo "            ";
                    $context["enabled"] = true;
                    // line 11
                    echo "            ";
                    $context["particle"] = $this->getAttribute(($context["segment"] ?? null), "attributes", []);
                    // line 12
                    echo "        ";
                } else {
                    // line 13
                    echo "            ";
                    $context["enabled"] = $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "get", [0 => (("particles." . $this->getAttribute(($context["segment"] ?? null), "subtype", [])) . ".enabled"), 1 => 1], "method");
                    // line 14
                    echo "            ";
                    $context["particle"] = $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "getJoined", [0 => ("particles." . $this->getAttribute(($context["segment"] ?? null), "subtype", [])), 1 => $this->getAttribute(($context["segment"] ?? null), "attributes", [])], "method");
                    // line 15
                    echo "        ";
                }
                // line 16
                echo "    ";
            }
            // line 17
            echo "
    ";
            // line 18
            ob_start();
            // line 19
            echo "        ";
            if ((($context["enabled"] ?? null) && ((null === $this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "enabled", [])) || $this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "enabled", [])))) {
                // line 20
                echo "            ";
                $this->loadTemplate([0 => (("particles/" . $this->getAttribute(($context["segment"] ?? null), "subtype", [])) . ".html.twig"), 1 => (("@particles/" . $this->getAttribute(                // line 21
($context["segment"] ?? null), "subtype", [])) . ".html.twig"), 2 => "@nucleus/content/missing.html.twig"], "@nucleus/content/particle.html.twig", 20)->display($context);
                // line 23
                echo "        ";
            }
            // line 24
            echo "    ";
            $context["html"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
            // line 25
            echo "    ";
            $context["html"] = twig_trim_filter(($context["html"] ?? null));
            // line 26
            echo "
    ";
            // line 27
            $context["classes"] = twig_trim_filter(((( !($context["inContent"] ?? null)) ? ("g-content g-particle ") : ("g-particle ")) . twig_join_filter($this->getAttribute(($context["segment"] ?? null), "classes", []), " ")));
            // line 28
            if (($context["html"] ?? null)) {
                // line 29
                if ($this->getAttribute(($context["gantry"] ?? null), "debug", [])) {
                    echo "<!-- START PARTICLE ";
                    echo twig_escape_filter($this->env, ($context["id"] ?? null), "html", null, true);
                    echo " -->";
                }
                // line 30
                echo "
            ";
                // line 31
                if ( !array_key_exists("ajax", $context)) {
                    echo "<div id=\"";
                    echo twig_escape_filter($this->env, ($context["id"] ?? null), "html", null, true);
                    echo "-particle\" class=\"";
                    echo twig_escape_filter($this->env, ($context["classes"] ?? null), "html", null, true);
                    echo "\">";
                }
                // line 32
                echo "            ";
                echo ($context["html"] ?? null);
                echo "
            ";
                // line 33
                if ( !array_key_exists("ajax", $context)) {
                    echo "</div>";
                }
                // line 34
                echo "            ";
                if ($this->getAttribute(($context["gantry"] ?? null), "debug", [])) {
                    echo "<!-- END PARTICLE ";
                    echo twig_escape_filter($this->env, ($context["id"] ?? null), "html", null, true);
                    echo " -->";
                }
            }
        } catch (\Exception $e) {
            if ($context['gantry']->debug()) throw $e;
            if (\GANTRY_DEBUGGER) \Gantry\Debugger::addException($e);
            $context['e'] = $e;
            // line 38
            echo "    <div class=\"alert alert-error\"><strong>Error</strong> while rendering ";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["segment"] ?? null), "subtype", []), "html", null, true);
            echo " particle.</div>
";
        }
    }

    public function getTemplateName()
    {
        return "@nucleus/content/particle.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  141 => 38,  129 => 34,  125 => 33,  120 => 32,  112 => 31,  109 => 30,  103 => 29,  101 => 28,  99 => 27,  96 => 26,  93 => 25,  90 => 24,  87 => 23,  85 => 21,  83 => 20,  80 => 19,  78 => 18,  75 => 17,  72 => 16,  69 => 15,  66 => 14,  63 => 13,  60 => 12,  57 => 11,  54 => 10,  51 => 9,  48 => 8,  46 => 7,  43 => 6,  40 => 5,  37 => 4,  34 => 3,  31 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% try %}
    {% set in_particle = (in_particle ?? 0) + 1 %}
    {% if in_particle > 5 %}
        {% throw 500 'Particle loop detected' %}
    {% endif %}

    {% set id = segment.id %}
    {% if not particle %}
        {% if noConfig %}
            {% set enabled = true %}
            {% set particle = segment.attributes %}
        {% else %}
            {% set enabled = gantry.config.get('particles.' ~ segment.subtype ~ '.enabled', 1) %}
            {% set particle = gantry.config.getJoined('particles.' ~ segment.subtype, segment.attributes) %}
        {% endif %}
    {% endif %}

    {% set html %}
        {% if enabled and (segment.attributes.enabled is null or segment.attributes.enabled) %}
            {% include ['particles/' ~ segment.subtype ~ '.html.twig',
            '@particles/' ~ segment.subtype ~ '.html.twig',
            '@nucleus/content/missing.html.twig'] %}
        {% endif %}
    {% endset %}
    {% set html = html|trim %}

    {% set classes = ((not inContent ? 'g-content g-particle ' : 'g-particle ') ~ segment.classes|join(' '))|trim %}
    {%- if html -%}
            {% if gantry.debug %}<!-- START PARTICLE {{ id }} -->{% endif %}

            {% if ajax is not defined %}<div id=\"{{ id }}-particle\" class=\"{{ classes }}\">{% endif %}
            {{ html|raw }}
            {% if ajax is not defined %}</div>{% endif %}
            {% if gantry.debug %}<!-- END PARTICLE {{ id }} -->{% endif %}
    {%- endif -%}

{% catch %}
    <div class=\"alert alert-error\"><strong>Error</strong> while rendering {{ segment.subtype }} particle.</div>
{% endtry %}
", "@nucleus/content/particle.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\engines\\nucleus\\templates\\content\\particle.html.twig");
    }
}
